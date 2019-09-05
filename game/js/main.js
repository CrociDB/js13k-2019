let dialog = new Dialog();

(function() {
    dialog.showList([
        "I am very excited today. I really love books, you know?",
        "And got two new arrivals today in a large crate this morning. I am bringing them with me to The Library.",
        "I know it will be a real busy day, but I hope to have enough time to check them out.",
    ], "Daisy Walker", () => {
        dialog.showChoice([
            { t: "Oh! What are their titles?", c: () => {} },
            { t: "I am not really into books, I am sorry, Mrs.", c: () => {} }
        ]);
    }, true);
})();
