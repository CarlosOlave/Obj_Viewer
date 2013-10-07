/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/30/13
 * Time: 1:35 PM
 */

"use strict";

define(["Libs/glMatrix",
    "Libs/web-glutils"],
    function() {

        var functionRet = function Renderer() {

            // Closure.
            var self = this;

            ///////////////////////////////////////
            // Public functions

            // Function initializes renderer object.
            self.Initialize = function (aObjTriangles) {

                for (var i=0; i<aObjTriangles.length; i++) {

                    var obj = aObjTriangles[i];

                    // Set the Y and Z values.
                    m_aYValues.push(obj.v1[1]);
                    m_aYValues.push(obj.v2[1]);
                    m_aYValues.push(obj.v3[1]);
                    m_aZValues.push(obj.v1[2]);
                    m_aZValues.push(obj.v2[2]);
                    m_aZValues.push(obj.v3[2]);

                    // Extract all three vertices.
                    m_aVertex.push(obj.v1[0]);
                    m_aVertex.push(obj.v1[1]);
                    m_aVertex.push(obj.v1[2]);
                    m_aVertex.push(obj.v2[0]);
                    m_aVertex.push(obj.v2[1]);
                    m_aVertex.push(obj.v2[2]);
                    m_aVertex.push(obj.v3[0]);
                    m_aVertex.push(obj.v3[1]);
                    m_aVertex.push(obj.v3[2]);

                    // Extract all three normal vertices.
                    m_aVertexNorm.push(obj.vn1[0]);
                    m_aVertexNorm.push(obj.vn1[1]);
                    m_aVertexNorm.push(obj.vn1[2]);
                    m_aVertexNorm.push(obj.vn2[0]);
                    m_aVertexNorm.push(obj.vn2[1]);
                    m_aVertexNorm.push(obj.vn2[2]);
                    m_aVertexNorm.push(obj.vn3[0]);
                    m_aVertexNorm.push(obj.vn3[1]);
                    m_aVertexNorm.push(obj.vn3[2]);

                    // For each vertices set two texture points.
                    m_aTexture.push(0.0);
                    m_aTexture.push(1.0);

                    m_aTexture.push(1.0);
                    m_aTexture.push(0.0);

                    m_aTexture.push(1.0);
                    m_aTexture.push(1.0);
                }

                m_functionCalculateTranslationYZ();
            };

            // Function starts rendering .obj scene.
            self.Start = function () {

                m_fYTransValue = m_aTransYZ[0];
                m_fZTransValue = m_aTransYZ[1];
                m_fZTransValue *= 5;

                var canvas = document.getElementById("renderer-canvas");
                m_functionInitGL(canvas);
                m_functionInitShaders();
                m_functionInitTextures();
            };

            ///////////////////////////////////////
            // Private functions

            // Calculates the translation vector.
            var m_functionCalculateTranslationYZ = function() {

                if ((m_aYValues.length === 0) ||
                    (m_aZValues.length === 0)) {

                    return;
                }

                var yMinValue = Math.min.apply(null, m_aYValues);
                var yMaxValue = Math.max.apply(null, m_aYValues);

                var zMinValue = Math.min.apply(null, m_aZValues);
                var zMaxValue = Math.max.apply(null, m_aZValues);

                m_aTransYZ = [((yMinValue+yMaxValue)/2), (Math.abs(zMinValue)+Math.abs(zMaxValue))/2];
            };

            var m_functionInitGL = function(canvas) {

                try {

                    gl = canvas.getContext("experimental-webgl");
                    gl.viewportWidth = canvas.width;
                    gl.viewportHeight = canvas.height;
                } catch (e) {

                    alert(e);
                }

                if (!gl) {

                    alert("Could not initialise WebGL, sorry :-(");
                }
            };

            var m_functionGetShader = function(gl, id) {

                var shaderScript = document.getElementById(id);
                if (!shaderScript) {
                    return null;
                }

                var str = "";
                var k = shaderScript.firstChild;
                while (k) {
                    if (k.nodeType == 3) {
                        str += k.textContent;
                    }
                    k = k.nextSibling;
                }

                var shader;
                if (shaderScript.type == "x-shader/x-fragment") {
                    shader = gl.createShader(gl.FRAGMENT_SHADER);
                } else if (shaderScript.type == "x-shader/x-vertex") {
                    shader = gl.createShader(gl.VERTEX_SHADER);
                } else {
                    return null;
                }

                gl.shaderSource(shader, str);
                gl.compileShader(shader);

                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    alert(gl.getShaderInfoLog(shader));
                    return null;
                }

                return shader;
            };

            var m_functionInitShaders  = function() {

                var fragmentShader = m_functionGetShader(gl, "per-fragment-lighting-fs");
                var vertexShader = m_functionGetShader(gl, "per-fragment-lighting-vs");

                m_shaderProgram = gl.createProgram();
                gl.attachShader(m_shaderProgram, vertexShader);
                gl.attachShader(m_shaderProgram, fragmentShader);
                gl.linkProgram(m_shaderProgram);

                if (!gl.getProgramParameter(m_shaderProgram, gl.LINK_STATUS)) {
                    alert("Could not initialise shaders");
                }

                gl.useProgram(m_shaderProgram);

                m_shaderProgram.vertexPositionAttribute = gl.getAttribLocation(m_shaderProgram, "aVertexPosition");
                gl.enableVertexAttribArray(m_shaderProgram.vertexPositionAttribute);

                m_shaderProgram.vertexNormalAttribute = gl.getAttribLocation(m_shaderProgram, "aVertexNormal");
                gl.enableVertexAttribArray(m_shaderProgram.vertexNormalAttribute);

                m_shaderProgram.textureCoordAttribute = gl.getAttribLocation(m_shaderProgram, "aTextureCoord");
                gl.enableVertexAttribArray(m_shaderProgram.textureCoordAttribute);

                m_shaderProgram.pMatrixUniform = gl.getUniformLocation(m_shaderProgram, "uPMatrix");
                m_shaderProgram.mvMatrixUniform = gl.getUniformLocation(m_shaderProgram, "uMVMatrix");
                m_shaderProgram.nMatrixUniform = gl.getUniformLocation(m_shaderProgram, "uNMatrix");
                m_shaderProgram.samplerUniform = gl.getUniformLocation(m_shaderProgram, "uSampler");
                m_shaderProgram.materialShininessUniform = gl.getUniformLocation(m_shaderProgram, "uMaterialShininess");
                m_shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(m_shaderProgram, "uShowSpecularHighlights");
                m_shaderProgram.useTexturesUniform = gl.getUniformLocation(m_shaderProgram, "uUseTextures");
                m_shaderProgram.useLightingUniform = gl.getUniformLocation(m_shaderProgram, "uUseLighting");
                m_shaderProgram.ambientColorUniform = gl.getUniformLocation(m_shaderProgram, "uAmbientColor");
                m_shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(m_shaderProgram, "uPointLightingLocation");
                m_shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(m_shaderProgram, "uPointLightingSpecularColor");
                m_shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(m_shaderProgram, "uPointLightingDiffuseColor");
            };

            var m_functionHandleLoadedTexture = function(texture) {

                try {
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.bindTexture(gl.TEXTURE_2D, null);

                    return null;
                }
                catch (e) {

                    return e;
                }
            };

            var m_functionInitTextures = function() {

                m_galvanizedTexture = gl.createTexture();
                m_galvanizedTexture.image = new Image();
                m_galvanizedTexture.image.onload = function () {

                    var exceptionRet = m_functionHandleLoadedTexture(m_galvanizedTexture);
                    if (exceptionRet !== null) {

                        alert(exceptionRet);
                        return;
                    }

                    m_functionAsynchronousStart();
                };

                m_galvanizedTexture.crossOrigin = "Anonymous";
                m_galvanizedTexture.image.src = "./Source/Textures/arroway.de_metal+structure+06_d100_flat.jpg";
            };

            var m_functionSetMatrixUniforms = function() {

                gl.uniformMatrix4fv(m_shaderProgram.pMatrixUniform, false, m_pMatrix);
                gl.uniformMatrix4fv(m_shaderProgram.mvMatrixUniform, false, m_mvMatrix);

                var normalMatrix = mat3.create();
                mat4.toInverseMat3(m_mvMatrix, normalMatrix);
                mat3.transpose(normalMatrix);
                gl.uniformMatrix3fv(m_shaderProgram.nMatrixUniform, false, normalMatrix);
            };

            var m_functionDegToRad = function(degrees) {

                return degrees * Math.PI / 180;
            };

            var m_functionInitBuffers = function() {

                // Set normals
                m_objVertexNormalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, m_objVertexNormalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m_aVertexNorm), gl.STATIC_DRAW);
                m_objVertexNormalBuffer.itemSize = 3;
                m_objVertexNormalBuffer.numItems = m_aVertexNorm.length / 3;

                // Set Texture.
                m_objVertexTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, m_objVertexTextureCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m_aTexture), gl.STATIC_DRAW);
                m_objVertexTextureCoordBuffer.itemSize = 2;
                m_objVertexTextureCoordBuffer.numItems = m_aTexture.length / 2;

                // Set Position.
                m_objVertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, m_objVertexPositionBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m_aVertex), gl.STATIC_DRAW);
                m_objVertexPositionBuffer.itemSize = 3;
                m_objVertexPositionBuffer.numItems = m_aVertex.length / 3;
            };

            var m_functionDrawScene = function() {

                gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                if (m_objVertexPositionBuffer == null
                    || m_objVertexNormalBuffer == null
                    || m_objVertexTextureCoordBuffer == null) {
                    return;
                }

                mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 220, m_pMatrix);

                gl.uniform1i(m_shaderProgram.showSpecularHighlightsUniform, 1);

                gl.uniform1i(m_shaderProgram.useLightingUniform, 1);
                if (1) {

                    gl.uniform3f(
                        m_shaderProgram.ambientColorUniform,
                        parseFloat(document.getElementById("ambientR").value),
                        parseFloat(document.getElementById("ambientG").value),
                        parseFloat(document.getElementById("ambientB").value)
                    );

                    gl.uniform3f(
                        m_shaderProgram.pointLightingLocationUniform,
                        parseFloat(document.getElementById("lightPositionX").value),
                        parseFloat(document.getElementById("lightPositionY").value),
                        parseFloat(document.getElementById("lightPositionZ").value)
                    );

                    gl.uniform3f(
                        m_shaderProgram.pointLightingSpecularColorUniform,
                        parseFloat(document.getElementById("specularR").value),
                        parseFloat(document.getElementById("specularG").value),
                        parseFloat(document.getElementById("specularB").value)
                    );

                    gl.uniform3f(
                        m_shaderProgram.pointLightingDiffuseColorUniform,
                        parseFloat(document.getElementById("diffuseR").value),
                        parseFloat(document.getElementById("diffuseG").value),
                        parseFloat(document.getElementById("diffuseB").value)
                    );
                }

                gl.uniform1i(m_shaderProgram.useTexturesUniform, 1);

                mat4.identity(m_mvMatrix);
                mat4.translate(m_mvMatrix, [0, -m_fYTransValue, -m_fZTransValue]);
                mat4.rotate(m_mvMatrix, m_functionDegToRad(m_objAngle), [0, 1, 0]);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, m_galvanizedTexture);

                gl.uniform1i(m_shaderProgram.samplerUniform, 0);

                gl.uniform1f(m_shaderProgram.materialShininessUniform, parseFloat(document.getElementById("shininess").value));
                //gl.uniform1f(shaderProgram.materialShininessUniform, dShininess);

                gl.bindBuffer(gl.ARRAY_BUFFER, m_objVertexPositionBuffer);
                gl.vertexAttribPointer(m_shaderProgram.vertexPositionAttribute, m_objVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, m_objVertexTextureCoordBuffer);
                gl.vertexAttribPointer(m_shaderProgram.textureCoordAttribute, m_objVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, m_objVertexNormalBuffer);
                gl.vertexAttribPointer(m_shaderProgram.vertexNormalAttribute, m_objVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

                m_functionSetMatrixUniforms();
                gl.drawArrays(gl.TRIANGLES, 0, m_objVertexPositionBuffer.numItems);
            };

            var m_functionAnimate = function() {

                var timeNow = new Date().getTime();
                if (m_lastTime != 0) {
                    var elapsed = timeNow - m_lastTime;

                    m_objAngle += 0.05 * elapsed;
                }
                m_lastTime = timeNow;
            };

            var m_functionTick = function() {

                requestAnimFrame(m_functionTick);
                m_functionDrawScene();
                m_functionAnimate();
            };

            var m_functionAsynchronousStart = function () {

                m_functionInitBuffers();

                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);

                m_functionTick();
            };

            ///////////////////////////////////////
            // Private fields.

            var m_aVertex = [];
            var m_aVertexNorm = [];
            var m_aTexture = [];
            var m_aYValues = [];
            var m_aZValues = [];
            var m_aTransYZ = [];

            var m_fYTransValue = 0;
            var m_fZTransValue = 0;

            var m_shaderProgram;
            var gl;
            var m_galvanizedTexture;

            var m_objVertexPositionBuffer;
            var m_objVertexNormalBuffer;
            var m_objVertexTextureCoordBuffer;

            var m_mvMatrix = mat4.create();
            var m_pMatrix = mat4.create();

            var m_objAngle = 180;
            var m_lastTime = 0;
        };

        return new functionRet();
    });