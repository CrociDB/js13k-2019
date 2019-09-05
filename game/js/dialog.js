class Dialog {
    constructor() {
        this.dialogElement = gId("dialog");
        this.dialogText = qSelA("#dialog p")[0];
        this.dialogAuthor = qSelA("#dialog .author")[0];
        this.choiceElement = gId("choice");
        this.choiceText = [ gId("c1"), gId("c2") ];
        this.callback = null;
        this.active = false;
        this.finished = false;
        this.clickd = this.click.bind(this);
    }

    showList(messages, author, callback) {
        this.list = messages;
        this.currentInList = 0;

        this.callback = callback;

        playaudio(SOUNDS.dialog_open);
        document.body.addEventListener('click', this.clickd);
        
        this._show(messages[this.currentInList], author);
    }
    
    _show(message, author) {
        this.dialogElement.classList.remove("hidden");

        console.log(this.dialogText);
        this.dialogAuthor.innerHTML = "";
        
        // appearing effect
        let total = message.length;
        let step = Math.ceil(total / 30);
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
            that.dialogAuthor.innerHTML = "&#8212; " + author;
            that.finished = true;
        });
        
        this.active = true;
    }
    
    show(message, author, callback) {
        this.callback = callback;
        this.list = null;
        this.currentInList = -1;
        this._show(message, author);
        document.body.addEventListener('click', this.clickd);
        
        playaudio(SOUNDS.dialog_open);
    }
    
    close() {
        playaudio(SOUNDS.dialog_close);
        this.dialogElement.classList.add("hidden");
        this.callback();
        this.finished = false;
        document.body.removeEventListener('click', this.clickd);
    }

    click() {
        if (this.active && this.finished) {
            if (this.list != null && this.currentInList > -1 && this.currentInList < this.list.length - 1) {
                playaudio(SOUNDS.dialog_confirm);
                this.currentInList++;
                this.finished = false;
                this._show(this.list[this.currentInList]);
            } else {
                this.close();
            }
        }
    }
}