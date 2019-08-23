class App {
    constructor() {
        this.canvas = new Canvas();
    }

    downloadShaders(finishCallback)
    {
        let loaded = 0;
        let shaders = [];
        let scripts = document.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++)
        {
            if (scripts[i].type == "notjs")
            {
                shaders.push(scripts[i]);
            }
        }

        shaders.forEach((s) => {
            let req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                s.innerHTML = req.responseText;
                if (++loaded >= shaders.length) {
                    finishCallback();
                }
            });
            req.open("GET", s.src);
            req.send();
        });
    }

    init() {
        this.downloadShaders(this._init.bind(this));
    }
    
    _init() {
        this.canvas.init();

        this.shader = new Shader(this.canvas.gl);
        this.shader.setShaders(gSh("sh-vert"), gSh("sh-frag-game"));

        window.requestAnimationFrame(this.update.bind(this));
    }
    
    update() {
        this.shader.use();
        this.canvas.update();

        window.requestAnimationFrame(this.update.bind(this));
    }
}