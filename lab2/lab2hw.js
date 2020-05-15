var gl;
var shaderProgram;
var uPMatrix;
var uMVMatrix;
var vertexPositionBuffer;
var vertexColorBuffer;

function startGL() {
    alert("Started webGL");
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    const vertextShaderSource = `
    precision highp float;
    attribute vec3 aVertexPosition; 
    attribute vec3 aVertexColor;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    varying vec3 vColor;
    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      vColor = aVertexColor;
    }
  `;

    const fragmentShaderSource = `
    precision highp float;
    varying vec3 vColor;
    void main(void) {
       gl_FragColor = vec4(vColor, 1.0);
    }
  `;

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.shaderSource(vertexShader, vertextShaderSource);
    gl.compileShader(fragmentShader);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader));
        return null;
    }
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader));
        return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Could not initialise shaders");

    let vertexPosition = [
        // //Top vertical
        //     A                 B                 E
        -0.1, +1, +0.25, +0.1, +1, +0.25, -0.1, +1, +0.05,
        //     E                 F                 B
        -0.1, +1, +0.05, +0.1, +1, +0.05, +0.1, +1, +0.25,

        // //Top diagonal
        //   I                   J                    N
        -0.5, -0.1, +0.25, +0.5, +0.25, +0.25, +0.5, +0.25, +0.05,
        //   N                    M                  I
        +0.5, +0.25, +0.05, -0.5, -0.1, +0.05, -0.5, -0.1, +0.25,

        // //Top horizontal
        //   P                    R                    X
        0, -0.8, +0.25, +0.75, -0.8, +0.25, +0.75, -0.8, +0.05,
        //       X               W               P
        +0.75, -0.8, +0.05, 0, -0.8, +0.05, 0, -0.8, +0.25,

        // //Left vertical
        //     C                 G                 E
        -0.1, +1, +0.25, -0.1, -1, +0.05, -0.1, +1, +0.05,
        //     E                 A                 C
        -0.1, +1, +0.05, -0.1, +1, +0.25, -0.1, +1, +0.25,

        // //Left diagonal
        //      I                   K                    O
        -0.5, -0.1, +0.25, -0.5, -0.25, +0.25, -0.5, -0.25, 0.05,
        //      O                   M                   I
        -0.5, -0.25, 0.05, -0.5, -0.1, +0.05, -0.5, -0.1, +0.25,

        // //Left horizontal
        //   P               S              Y
        0, -0.8, +0.25, 0, -1, +0.25, 0, -1, +0.05,
        //  Y               W                P
        0, -1, +0.05, 0, -0.8, +0.05, 0, -0.8, +0.25,

        // //Right vertical
        //     D                 H                 F
        +0.1, -1, +0.25, +0.1, -1, +0.05, +0.1, +1, +0.05,
        //     F                 B                 D
        +0.1, +1, +0.05, +0.1, +1, +0.25, +0.1, -1, +0.25,

        // //Right diagonal
        //      L                    J                   N
        +0.5, +0.1, +0.25, +0.5, +0.25, +0.25, +0.5, +0.25, +0.05,
        //       N                  U                   L
        +0.5, +0.25, +0.05, +0.5, +0.1, +0.05, +0.5, +0.1, +0.25,

        // //Right horizontal
        //   R                       T                  Z
        +0.75, -0.8, +0.25, +0.75, -1, +0.25, +0.75, -1, +0.05,
        //      Z               X                    R
        +0.75, -1, +0.05, +0.75, -0.8, +0.05, +0.75, -0.8, +0.25,

        // //Front vertical
        //     D                 C                 B
        +0.1, -1, +0.25, -0.1, -1, +0.25, +0.1, +1, +0.25,
        //     A                 B                 C
        -0.1, +1, +0.25, +0.1, +1, +0.25, -0.1, -1, +0.25,

        // //Front diagonal
        //      L                   J                    K
        +0.5, +0.1, +0.25, +0.5, +0.25, +0.25, -0.5, -0.25, +0.25,
        //      I                   K                    J
        -0.5, -0.1, +0.25, -0.5, -0.25, +0.25, +0.5, +0.25, +0.25,

        // //Front horizontal
        //      T                   R               S
        +0.75, -1, +0.25, +0.75, -0.8, +0.25, 0, -1, +0.25,
        //   P               S                   R
        0, -0.8, +0.25, 0, -1, +0.25, +0.75, -0.8, +0.25,

        // //Back vertical
        //     G                H                  E
        -0.1, -1, +0.05, +0.1, -1, +0.05, -0.1, +1, +0.05,
        //     E                F                  H
        -0.1, +1, +0.05, +0.1, +1, +0.05, +0.1, -1, +0.05,

        // //Back diagonal
        //      O                   U                   N
        -0.5, -0.25, 0.05, +0.5, +0.1, +0.05, +0.5, +0.25, +0.05,
        //      N                    M                   O
        +0.5, +0.25, +0.05, -0.5, -0.1, +0.05, -0.5, -0.25, 0.05,

        // //Back horizontal
        //  Y                 Z                  X
        0, -1, +0.05, +0.75, -1, +0.05, +0.75, -0.8, +0.05,
        //       X          W                   Y
        +0.75, -0.8, +0.05, 0, -0.8, +0.05, 0, -1, +0.05,

        // //Bottom vertical
        //     C                D                  G
        -0.1, -1, +0.25, +0.1, -1, +0.25, -0.1, -1, +0.05,
        //     G                H                  D
        -0.1, -1, +0.05, +0.1, -1, +0.05, +0.1, -1, +0.25,

        // //Botoom diagonal
        //       K                   L                   U
        -0.5, -0.25, +0.25, +0.5, +0.1, +0.25, +0.5, +0.1, +0.05,
        //      U                   O                   K
        +0.5, +0.1, +0.05, +0.5, +0.1, +0.25, -0.5, -0.25, +0.25,

        // //Bottom horizontal
        //  S                  T                  Z
        0, -1, +0.25, +0.75, -1, +0.25, +0.75, -1, +0.05,
        //      Z              Y              S
        +0.75, -1, +0.05, 0, -1, +0.05, 0, -1, +0.25
    ]

    let vertexColor = [
        // //Top vertical
        //R   G    B     R    G    B     R    G    B    <0;1>f
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Top diagonal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Top horizontal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Left vertical
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Left diagonal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Left horizontal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Right vertical
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Right diagonal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Right horizontal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Front vertical
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Front diagonal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Front horizontal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Back vertical
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Back diagonal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Back horizontal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Bottom vertical
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Botoom diagonal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // //Bottom horizontal
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]

    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = 36;

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    vertexColorBuffer.itemSize = 3;
    vertexColorBuffer.numItems = 36;

    let aspect = gl.viewportWidth / gl.viewportHeight;
    let fov = 45.0 * Math.PI / 180.0;
    let zFar = 100.0;
    let zNear = 0.1;

    uPMatrix = [
        1.0 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
        0, 1.0 / (Math.tan(fov / 2)), 0, 0,
        0, 0, -(zFar + zNear) / (zFar - zNear), -1,
        0, 0, -(2 * zFar * zNear) / (zFar - zNear), 0.0,
    ];
    Tick();
}

var angleZ = 0.0;
var angleY = 0.0;
var angleX = 0.0;
var tz = -5.0;


function Tick(){
    // Rotation steering
    angleX+=1;
    angleY+=1;
    angleZ+=1;

    let uMVMatrix = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    let uMVRotZ = [
        +Math.cos(angleZ*Math.PI/180.0),+Math.sin(angleZ*Math.PI/180.0),0,0,
        -Math.sin(angleZ*Math.PI/180.0),+Math.cos(angleZ*Math.PI/180.0),0,0,
        0,0,1,0,
        0,0,0,1
    ];

    let uMVRotY = [
        +Math.cos(angleY*Math.PI/180.0),0,-Math.sin(angleY*Math.PI/180.0),0,
        0,1,0,0,
        +Math.sin(angleY*Math.PI/180.0),0,+Math.cos(angleY*Math.PI/180.0),0,
        0,0,0,1
    ];

    let uMVRotX = [
        1,0,0,0,
        0,+Math.cos(angleX*Math.PI/180.0),+Math.sin(angleX*Math.PI/180.0),0,
        0,-Math.sin(angleX*Math.PI/180.0),+Math.cos(angleX*Math.PI/180.0),0,
        0,0,0,1
    ];

    let uMVTranslateZ = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,tz,1
    ];

    uMVMatrix = MatrixMul(uMVMatrix,uMVRotX);
    uMVMatrix = MatrixMul(uMVMatrix,uMVRotY);
    uMVMatrix = MatrixMul(uMVMatrix,uMVRotZ);
    uMVMatrix = MatrixMul(uMVMatrix,uMVTranslateZ);

    // until now

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(1.0,0.0,0.0,1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram)

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, new Float32Array(uPMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, new Float32Array(uMVMatrix));

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexPosition"));
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"), vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexColor"));
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexColor"), vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems*vertexPositionBuffer.itemSize);

    setTimeout(Tick,100);
}

function MatrixMul(aMatrix, bMatrix) {
    let cMatrix = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]
    for(let i=0;i<4;i++)
    {
        for(let j=0;j<4;j++)
        {
            cMatrix[i*4+j] = 0.0;
            for(let k=0;k<4;k++)
            {
                cMatrix[i*4+j]+= aMatrix[i*4+k] * bMatrix[k*4+j];
            }
        }
    }
    return cMatrix;
}