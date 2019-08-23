class Canvas {
    constructor() {
        this.c = gId("igame");
        this.gl = this.c.getContext("webgl2");
        this.w = this.c.width;
        this.h = this.c.height;
    }

    init() {
        let gl = this.gl;

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        let positions = [
            -1, -1, 0, 0, 0,
            -1, 1, 0, 0, 1,
            1, 1, 0, 1, 1,

            1, 1, 0, 1, 1,
            1, -1, 0, 1, 0,
            -1, -1, 0, 0, 0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    
    update() {
        let gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);     
        
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(0, 
            3, gl.FLOAT, false, 5 * 4, 0);
            
        gl.vertexAttribPointer(1, 
            2, gl.FLOAT, false, 5 * 4, 3 * 4);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

class Shader {
    constructor(gl) {
        this.gl = gl;
        this.uniforms = {};
    }

    setShaders(v, f) {
        let gl = this.gl;
        let vsh = this.createShader(gl.VERTEX_SHADER, v);
        let fsh = this.createShader(gl.FRAGMENT_SHADER, f);

        this.program = this.createProgram(vsh, fsh);
        this.uniforms = {};
        this.use();
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
