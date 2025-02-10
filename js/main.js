new Vue({
    el: "#app",
    data: {
        columns: [],
        isFirstColumnLocked: false,
    },
    created() {
        this.loadFromLocalStorage();
    },
    watch: {
        columns: {
            deep: true,
            handler() {
                this.saveToLocalStorage();
                this.checkFirstColumnLock();
            },
        },
    },
    methods: {
        loadFromLocalStorage() {
            const savedData = localStorage.getItem("vue_notes_columns");
            if (savedData) {
                this.columns = JSON.parse(savedData);
            } else {
                this.columns = [
                    {
                        id: 1,
                        title: "Столбец 1",
                        cards: [
                            {
                                id: "phantom",
                                title: "",
                                items: [],
                                newItemText: "",
                                completedAt: null,
                                isPhantom: true,
                            },
                        ],
                    },
                    { id: 2, title: "Столбец 2", cards: [] },
                    { id: 3, title: "Столбец 3", cards: [] },
                ];
            }
        },
        saveToLocalStorage() {
            localStorage.setItem("vue_notes_columns", JSON.stringify(this.columns));
        },
        checkFirstColumnLock() {
            const secondColumn = this.columns[1];
            const firstColumn = this.columns[0];
            const hasOver50PercentCard = firstColumn.cards.some(card => {
                const completedItems = card.items.filter(item => item.done).length;
                return card.items.length > 0 && (completedItems / card.items.length) > 0.49;
            });

            if (secondColumn.cards.length >= 5 && hasOver50PercentCard) {
                this.isFirstColumnLocked = true;
            } else if (this.columns[2].cards.some(c => c.items.length > 0)) {
                this.isFirstColumnLocked = false;
            }
        },

        checkPhantomCard() {
            const firstColumn = this.columns[0];
            const realCards = firstColumn.cards.filter((c) => !c.isPhantom);
            const phantomCard = firstColumn.cards.find((c) => c.isPhantom);

            if (phantomCard && realCards.length >= 3) {
                firstColumn.cards = firstColumn.cards.filter((c) => !c.isPhantom);
                return;
            }

            if (!phantomCard && realCards.length < 3) {
                firstColumn.cards.push({
                    id: "phantom",
                    title: "",
                    items: [],
                    newItemText: "",
                    completedAt: null,
                    isPhantom: true,
                });
            }
        },

        addItemToCard(card) {
            if (card.newItemText.trim() && this.isCardInFirstColumn(card)) {
                card.items.push({ text: card.newItemText, done: false, subitems: [] });
                card.newItemText = "";
                this.checkPhantomCard();
                this.checkTransformToReal(card);
            }
        },

        addSubitemToItem(item) {
            item.subitems.push({ text: item.newSubitemText, done: false });
            item.newSubitemText = "";
            this.checkCardProgress(card);
        },

        checkSubitemsProgress(item) {
            const uncompletedSubitems = item.subitems.filter(subitem => !subitem.done).length;
            return uncompletedSubitems === 0;
        },

        checkCardProgress(card) {
            const totalItems = card.items.length;
            const completedItems = card.items.filter((item) => item.done).length;
            if (totalItems === 0) return;
            const progress = completedItems / totalItems;

            if (progress === 1) {
                card.completedAt = new Date().toLocaleString();
                this.moveCard(card, 3);
            } else if (progress > 0.49) {
                this.moveCard(card, 2);
            } else if (progress <= 0.49 && this.isCardInColumn(card, 2)) {
                this.moveCard(card, 1);
            }

            this.checkFirstColumnLock();
        },

        isCardInFirstColumn(card) {
            return this.columns[0].cards.includes(card);
        },

        checkTransformToReal(card) {
            if (card.isPhantom && card.title.trim() && card.items.length >= 3) {
                card.id = Date.now();
                card.isPhantom = false;
                this.checkPhantomCard();
            }
        },



        isCardInColumn(card, columnId) {
            return this.columns[columnId - 1].cards.includes(card);
        },

        moveCard(card, targetColumnId) {
            const targetColumn = this.columns.find((col) => col.id === targetColumnId);
            if (targetColumnId === 2 && targetColumn.cards.length >= 5) {
                return;
            }

            this.columns.forEach((column) => {
                column.cards = column.cards.filter((c) => c.id !== card.id);
            });

            if (targetColumnId === 3) {
                card.isLocked = true;
            }

            targetColumn.cards.push(card);
            this.checkPhantomCard();
            this.checkFirstColumnLock();
        },

        isFirstColumnEditable() {
            return !this.isFirstColumnLocked;
        },
    },
});
