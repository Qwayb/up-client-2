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
                        completedAt: null,
                        isPhantom: true,
                    },
                ],
            },
            { id: 2, title: "Столбец 2", cards: [] },
            { id: 3, title: "Столбец 3", cards: [] },
        ],
    },
    methods: {
        checkPhantomCard() {
            const firstColumn = this.columns[0];
            const phantomCard = firstColumn.cards.find((c) => c.isPhantom);

            if (phantomCard && phantomCard.title.trim() && phantomCard.items.length >= 3) {
                phantomCard.id = Date.now();
                phantomCard.isPhantom = false;

                firstColumn.cards.push({
                    id: "phantom",
                    title: "",
                    items: [],
                    completedAt: null,
                    isPhantom: true,
                });
            }
        },
        addItemToPhantom() {
            const phantomCard = this.columns[0].cards.find((c) => c.isPhantom);
            if (phantomCard) {
                phantomCard.items.push({ text: "", done: false });
                this.checkPhantomCard();
            }
        },
    },
});
