    new Vue({
    el: "#app",
    data: {
        columns: [
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
        ],
        isFirstColumnLocked: false,
    },
    methods: {
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
            if (card.newItemText.trim()) {
                card.items.push({ text: card.newItemText, done: false });
                card.newItemText = "";
                this.checkPhantomCard();
                this.checkTransformToReal(card);
            }
        },

        checkTransformToReal(card) {
            if (card.isPhantom && card.title.trim() && card.items.length >= 3) {
                card.id = Date.now();
                card.isPhantom = false;
                this.checkPhantomCard();
            }
        },

        checkCardProgress(card) {
            const totalItems = card.items.length;
            const completedItems = card.items.filter((item) => item.done).length;

            if (totalItems === 0) return;

            const progress = completedItems / totalItems;

            if (progress === 1) {
                this.moveCard(card, 3);
                card.completedAt = new Date().toLocaleString();
            } else if (progress > 0.49) {
                this.moveCard(card, 2);
            }

            if (this.columns[1].cards.length >= 5 && progress > 0.49) {
                this.isFirstColumnLocked = true;
            }
        },

        moveCard(card, targetColumnId) {
            const targetColumn = this.columns.find((col) => col.id === targetColumnId);

            if (targetColumnId === 2 && targetColumn.cards.length >= 5) {
                return;
            }

            this.columns.forEach((column) => {
                column.cards = column.cards.filter((c) => c.id !== card.id);
            });

            targetColumn.cards.push(card);

            this.checkPhantomCard();

            if (targetColumnId === 3) {
                card.isLocked = true;
            }

            if (this.columns[1].cards.some(c => c.items.every(item => item.done))) {
                this.isFirstColumnLocked = false;
            }

            if (this.columns[1].cards.length < 5) {
                this.isFirstColumnLocked = false;
            }
        },

        isFirstColumnEditable() {
            return !this.isFirstColumnLocked;
        }
    },
});
