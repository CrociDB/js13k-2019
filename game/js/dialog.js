class Dialog {
    constructor() {
        this.dialogElement = gId("dialog");
        this.dialogText = qSelA("#dialog p")[0];
        this.dialogAuthor = qSelA("#dialog .author")[0];
        this.choiceElement = gId("choice");
        this.choiceText = [ gId("c1"), gId("c2") ];
        this.choiceText.forEach((e) => e.addEventListener("click", this.clickChoice.bind(this, e)));
        this.callback = null;
        this.active = false;
        this.finished = false;
        this.keep = false;
        document.body.addEventListener('click', this.click.bind(this));
        
        this.author = "";
    }

    showList(messages, author, callback, keep) {
        this.keep = keep;
        this.list = messages;
        this.author = author;
        this.currentInList = 0;

        this.callback = callback;

        playaudio(SOUNDS.dialog_open);
        
        this._show(messages[this.currentInList]);
    }
    
    show(message, author, callback, keep) {
        this.keep = keep;
        this.author = author;
        this.callback = callback;
        this.list = null;
        this.currentInList = -1;
        this._show(message);
        
        playaudio(SOUNDS.dialog_open);
    }
    
    _show(message) {
        this.dialogElement.classList.remove("hidden");

        console.log(message);
        this.dialogAuthor.innerHTML = "";
        
        // appearing effect
        let total = message.length;
        let step = Math.ceil(total / 50);
        let that = this;

        co(function*() {
            let c = 0;
            while (c < total) {
                that.dialogText.innerHTML = message.substr(0, c);
                c += step;
                if (c % 3 == 0) playaudio(SOUNDS.dialog_text);
                yield .05;
            }
            that.dialogText.innerHTML = message;
            that.dialogAuthor.innerHTML = "&#8212; " + that.author;
            that.finished = true;
        });
        
        this.active = true;
    }
    
    close() {
        playaudio(SOUNDS.dialog_close);
        this.dialogElement.classList.add("hidden");
        this.finished = false;
    }

    showChoice(choices) {
        for (let i = 0; i < choices.length; i++) {
            this.choiceText[i].innerHTML = choices[i].t;
            this.choiceText[i].callback = choices[i].c;
        }

        this.choiceElement.classList.remove("hidden");
    }
    
    closeChoice() {
        this.choiceElement.classList.add("hidden");
    }

    clickChoice(e) {
        this.closeChoice();
        this.close();

        e.callback();
    }

    click() {
        if (this.active && this.finished) {
            this.finished = false;
            if (this.list != null && this.currentInList > -1 && this.currentInList < this.list.length - 1) {
                playaudio(SOUNDS.dialog_confirm);
                this.currentInList++;
                this._show(this.list[this.currentInList]);
            } else {
                if (!this.keep) this.close();
                this.callback();
            }
        }
    }
}