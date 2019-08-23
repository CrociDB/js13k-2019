class Canvas {
    constructor() {
        this.c = gId("igame");
        this.gl = this.c.getContext("webgl2");
        this.w = this.c.width;
        this.h = this.c.height;
    }

    createShader(type, source) {
        let gl = this.gl;
        let sh = gl.createShader(type);
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        let success = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
        
        if (success) {
            return sh;
        }
        
        console.log(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
    }
    
    createProgram(vertexShader, fragmentShader) {
        let gl = this.gl;
        let pg = gl.createProgram();
        gl.attachShader(pg, vertexShader);
        gl.attachShader(pg, fragmentShader);
        gl.linkProgram(pg);
        let success = gl.getProgramParameter(pg, gl.LINK_STATUS);
    
        if (success) {
            return pg;
        }
    
        console.log(gl.getProgramInfoLog(pg));
        gl.deleteProgram(pg);
    }

    update() {

    }
}

class Shader {
    constructor(gl) {
        this.gl = gl;
        this.uniforms = {};
    }

    setShaders(v, f) {
        let gl = this.gl;
        let vsh = createShader(gl, gl.VERTEX_SHADER, v);
        let fsh = createShader(gl, gl.FRAGMENT_SHADER, f);

        this.program = createProgram(gl, vsh, fsh);
        this.uniforms = {};
        this.use();
    }

    use() {
        this.gl.useProgram(this.program);
    }

    u(uniform) {
        if (this.uniforms[uniform] === undefined) {
            this.uniforms[uniform] = this.gl.getUniformLocation(this.program, uniform);
        }

        return this.uniforms[uniform];
    }

    uniform1f(uniform, v) {
        this.gl.uniform1f(this.u(uniform), v);
    }
    
    uniformv(uniform, vec) {
        this.gl.uniform3f(this.u(uniform), vec.x, vec.y, vec.z);
    }
}
