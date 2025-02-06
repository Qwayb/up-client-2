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
    },
    methods: {
        checkPhantomCard() {
            const firstColumn = this.columns[0];
            const phantomCard = firstColumn.cards.find((c) => c.isPhantom);

            if (phantomCard && phantomCard.title.trim() && phantomCard.items.length >= 3) {
                phantomCard.id = Date.now(); // Присваиваем уникальный ID
                phantomCard.isPhantom = false; // Карточка становится настоящей

                // Добавляем новую фантомную карточку
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
                card.newItemText = ""; // Очистить поле ввода
                this.checkPhantomCard(); // Проверить условие для превращения в обычную карточку
            }
        },
    },
});
