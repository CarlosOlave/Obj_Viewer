/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/27/13
 * Time: 1:14 AM
 */


///////////////////////////////////////
// .obj scene.

"use strict";

define(["Scene/Structure/Utility/Vertex",
    "Scene/Structure/Utility/Normal",
    "Scene/Structure/Utility/MeshTriangle",
    "Scene/Structure/Utility/Edge",
    "Scene/Structure/Utility/FaceGroup"],
    function(Vertex,
        Normal,
        MeshTriangle,
        Edge,
        FaceGroup) {

        // Return a new instantiated.
        var functionRet = function HalfEdgeMesh() {

            // Closure
            var self = this;

            ////////////////////////////
            // Public methods.

            // Process an input file.
            self.ReadFile = function (file, callback) {

                try {

                    // Save the callback function to invoke
                    // once file processing is completed.
                    m_callback = callback;

                    var strFileExtension = file.name.split('.')[1];

                    // Check for valid file extension.
                    if (strFileExtension !== "obj") {

                        //
                    }

                    // Check Browser support for reading file.
                    if ((window.File && window.FileReader && window.FileList && window.Blob) === false)     {

                        //self.DisplayError("ParseFile", "Browser does not support FileReader API.");
                    }

                    // Start processing the file.
                    var exceptionRet = m_functionProcessFile(file);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                } catch (e) {

                    //return e;
                }
            };

            // Returns the total count of groups.
            /** @return int */
            self.GetGroupCount = function () {

                return m_iGroupCount;
            };

            // Returns the group object at a specific index location.
            self.GetGroupAt = function (iIndex) {

                return m_aGroupData[iIndex];
            };

            // Returns a triangle object at a specific index location.
            self.GetTriangleAt = function (iIndex) {

                return m_aTriangles[iIndex];
            };

            // Returns an edge object at a specific index location.
            self.GetEdgeAt = function (iIndex) {

                return m_aEdgeData[iIndex];
            };

            // Returns a vertex object at a specific index location.
            self.GetVertexAt = function (iIndex) {

                return m_aVertexData[iIndex];
            };

            // Returns a normal object at a specific index location
            self.GetNormalAt = function (iIndex) {

                return m_aNormalData[iIndex];
            };

            // Calculate normals for each triangle vertex.
            self.SetNormals = function () {

                var iEdgeID;
                var iStartEdgeID;
                var iVertexID;

                for (var i=0; i<m_iTriangleCount; i++) {

                    if (m_aTriangles[i].GetNormalIDAt(0) === -1) {

                        iStartEdgeID = m_aTriangles[i].GetEdgeID();
                        iEdgeID = iStartEdgeID;

                        do {

                            iVertexID = m_aEdgeData[iEdgeID].GetVertexID();
                            var bHasNormalInd = m_aVertexData[iVertexID].GetHasNormalInd();
                            if (bHasNormalInd !== true) {

                                // Calculate temp normal.
                                var aNormalTemp = [0, 0, 0];
                                for (var j=0; j<m_iEdgeCount; j=j+2) {

                                   if (m_aEdgeData[j].GetVertexID() === iVertexID) {

                                       var iTID = m_aEdgeData[j].GetTriangleID();
                                       if (iTID !== -1) {
                                           aNormalTemp[0] = aNormalTemp[0] +
                                               m_aTriangles[iTID].GetFaceNormalValueAt(0);
                                           aNormalTemp[1] = aNormalTemp[1] +
                                               m_aTriangles[iTID].GetFaceNormalValueAt(1);
                                           aNormalTemp[2] = aNormalTemp[2] +
                                               m_aTriangles[iTID].GetFaceNormalValueAt(2);
                                       }
                                   }
                                }

                                // Normalize temp normal.
                                var iLength = Math.sqrt(aNormalTemp[0] * aNormalTemp[0] +
                                    aNormalTemp[1] * aNormalTemp[1] +
                                    aNormalTemp[2] * aNormalTemp[2]);

                                aNormalTemp[0] /= iLength;
                                aNormalTemp[1] /= iLength;
                                aNormalTemp[2] /= iLength;

                                m_aVertexData[iVertexID].SetNormal(aNormalTemp);
                            }
                            iEdgeID = m_aEdgeData[iEdgeID].GetNextID();
                        } while (iEdgeID !== iStartEdgeID)
                    }
                }
            };

            // Returns calculate normals indicator.
            /** @return Boolean */
            self.CalculateNormalsInd = function () {

                return m_bCalculateNormals;
            };

            ////////////////////////////
            // Private methods.

            // Function read file line by line.
            var m_functionProcessFile = function (file) {

                try {

                    // Allocate reader object.
                    var reader = new FileReader();

                    //Closure to capture the file information.
                    reader.onload = (function(aFile) {
                        return function(e) {

                            // Split result and process line by line.
                            var aSplitResult = e.target.result.split('\n');
                            var strLine;
                            var exceptionRet = null;
                            for (var index=0; index<aSplitResult.length; index++) {

                                // Get a line.
                                strLine = aSplitResult[index];

                                // Process line.
                                exceptionRet = m_functionProcessLine(strLine);
                                if (exceptionRet !== null) {

                                }
                            }

                            // Invoke callback function and passed this object
                            // as input parameter.
                            m_callback.call(self);

                            //if ((aVertex === undefined) ||
                            //    (aVertex.length === 0))
                            //    self.DisplayError("ReadEntireFile", "No vertices to render.");

                            //var aTransYZ = self.CalculateTranslationYZ();

                            //renderer = new Renderer();
                            //renderer.webGLStart(aVertex, aColor, aVertexNormal, aTextures, aTransYZ);
                        };
                    })(file);

                    // Read file.
                    reader.readAsBinaryString(file);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Function process line of a file.
            var m_functionProcessLine = function (strLine) {

                try {

                    // Basic check on the input value before processing.
                    if ((strLine === undefined) ||
                        (strLine.length === 0)) {

                        return null;
                    }

                    var aSplitLine = strLine.split(' ');

                    aSplitLine = aSplitLine.clean("");

                    if (aSplitLine[0] === 'v') {

                        // Process Vertex
                        var objVertex = new Vertex(
                            [parseFloat(aSplitLine[1]), parseFloat(aSplitLine[2]), parseFloat(aSplitLine[3])],
                            m_iVertexCount);
                        m_iVertexCount++;
                        m_aVertexData.push(objVertex);
                    } else if (aSplitLine[0] === 'vn') {

                        // Process Vertex Normal.
                        var objVertexNormal = new Normal(
                            [parseFloat(aSplitLine[1]), parseFloat(aSplitLine[2]), parseFloat(aSplitLine[3])],
                            m_iNormalCount);
                        m_iNormalCount++;
                        m_aNormalData.push(objVertexNormal);
                    } else if (aSplitLine[0] === 'f') {

                        m_bCalculateNormals = true;

                        // Process Face.

                        // NOTE: A face can consist of the following format:
                        // 1) f v1 v2 v3 v4 ...                         (VERTEX)
                        // 2) f v1/vt1 v2/vt2 v3/vt3 ...                (VERTEX/TEXTURE COORDINATE)
                        // 3) f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3 ...    (VERTEX/TEXTURE COORDINATE/NORMAL)
                        // 4) f v1//vn1 v2//vn2 v3//vn3 ...             (VERTEX/NORMAL)

                        // Currently only support 1) VERTEX.

                        var aVertexIndex = aSplitLine.slice(1);
                        for (var i=1; i<aVertexIndex.length-1; i++) {

                            // Declare new mesh triangle object.
                            var objMeshTriangle = new MeshTriangle();

                            var tid = m_iTriangleCount;
                            m_iTriangleCount++;

                            // Calculate face normal.
                            objMeshTriangle.CalcFaceNormal(
                                m_aVertexData[parseInt(aVertexIndex[0]) - 1],
                                m_aVertexData[parseInt(aVertexIndex[i]) - 1],
                                m_aVertexData[parseInt(aVertexIndex[i + 1]) - 1]
                            );

                            m_functionAddToGroup(tid, m_strGroupName);

                            var iv0 = parseInt(aVertexIndex[0]) - 1;
                            var iv1 = parseInt(aVertexIndex[i]) - 1;
                            var iv2 = parseInt(aVertexIndex[i + 1]) - 1;
                            var i01 = -1;
                            var i12 = -1;
                            var i20 = -1;

                            var v01_flag = false;
                            var v01_mul = false;
                            var v12_flag = false;
                            var v12_mul = false;
                            var v20_flag = false;
                            var v20_mul = false;

                            for (var j=0; j<m_iEdgeCount; j++)  {

                                if ((m_aEdgeData[j].GetVertexID() === iv1) &&
                                    (m_aEdgeData[m_aEdgeData[j].GetPairID()].GetVertexID() === iv0) &&
                                    (m_aEdgeData[j].GetNextID() === -1)) {

                                    v01_flag = true;
                                    i01 = j;
                                }
                                if ((m_aEdgeData[j].GetVertexID() === iv1) &&
                                    (m_aEdgeData[m_aEdgeData[j].GetPairID()].GetVertexID() === iv0) &&
                                    (m_aEdgeData[j].GetNextID() !== -1)) {

                                    v01_mul = true;
                                }
                                if ((m_aEdgeData[j].GetVertexID() === iv2) &&
                                    (m_aEdgeData[m_aEdgeData[j].GetPairID()].GetVertexID() === iv1) &&
                                    (m_aEdgeData[j].GetNextID() === -1)) {

                                    v12_flag = true;
                                    i12 = j;
                                }
                                if ((m_aEdgeData[j].GetVertexID() === iv2) &&
                                    (m_aEdgeData[m_aEdgeData[j].GetPairID()].GetVertexID() === iv1) &&
                                    (m_aEdgeData[j].GetNextID() != -1)) {

                                    v12_mul = true;
                                }
                                if ((m_aEdgeData[j].GetVertexID() === iv0) &&
                                    (m_aEdgeData[m_aEdgeData[j].GetPairID()].GetVertexID() === iv2) &&
                                    (m_aEdgeData[j].GetNextID() === -1)) {

                                    v20_flag = true;
                                    i20 = j;
                                }
                                if ((m_aEdgeData[j].GetVertexID() === iv0) &&
                                    (m_aEdgeData[m_aEdgeData[j].GetPairID()].GetVertexID() === iv2) &&
                                    (m_aEdgeData[j].GetNextID() !== -1)) {

                                    v20_mul = true;
                                }
                            }

                            var objEdge1;
                            var objEdge2;
                            if (v01_flag) {

                                m_aEdgeData[i01].SetTriangleID(tid);
                                objMeshTriangle.SetEdgeID(i01);
                                if (v12_flag) {

                                    m_aEdgeData[i01].SetNextID(i12);
                                } else {

                                    m_aEdgeData[i01].SetNextID(m_iEdgeCount);
                                }
                            } else {

                                objEdge1 = new Edge();
                                objEdge2 = new Edge();

                                objEdge1.SetVertexID(iv1);
                                objEdge2.SetVertexID(iv0);

                                objEdge1.SetID(m_iEdgeCount);
                                objEdge2.SetPairID(m_iEdgeCount);
                                m_iEdgeCount++;

                                objEdge2.SetID(m_iEdgeCount);
                                objEdge1.SetPairID(m_iEdgeCount);
                                m_iEdgeCount++;

                                objEdge1.SetTriangleID(tid);
                                objEdge2.SetTriangleID(-1);
                                objMeshTriangle.SetEdgeID(objEdge1.GetID());

                                if (v12_flag) {

                                    objEdge1.SetNextID(i12);
                                } else {

                                    objEdge1.SetNextID(m_iEdgeCount);
                                }

                                objEdge2.SetNextID(-1);
                                objEdge1.SetMultiCase(v01_mul);
                                objEdge2.SetMultiCase(v01_mul);

                                m_aEdgeData.push(objEdge1);
                                m_aEdgeData.push(objEdge2);

                                i01 = objEdge1.GetID();
                                if (m_aVertexData[iv0].GetEdgeID() === -1) {

                                    m_aVertexData[iv0].SetEdgeID(objEdge1.GetID());
                                }
                            }

                            if (v12_flag) {

                                m_aEdgeData[i12].SetTriangleID(tid);
                                if (v20_flag) {

                                    m_aEdgeData[i12].SetNextID(i20);
                                } else {

                                    m_aEdgeData[i12].SetNextID(m_iEdgeCount);
                                }
                            } else {

                                objEdge1 = new Edge();
                                objEdge2 = new Edge();

                                objEdge1.SetVertexID(iv2);
                                objEdge2.SetVertexID(iv1);

                                objEdge1.SetID(m_iEdgeCount);
                                objEdge2.SetPairID(m_iEdgeCount);
                                m_iEdgeCount++;

                                objEdge2.SetID(m_iEdgeCount);
                                objEdge1.SetPairID(m_iEdgeCount);
                                m_iEdgeCount++;

                                objEdge1.SetTriangleID(tid);
                                objEdge2.SetTriangleID(-1);

                                if (v20_flag) {

                                    objEdge1.SetNextID(i20);
                                } else {

                                    objEdge1.SetNextID(m_iEdgeCount);
                                }

                                objEdge2.SetNextID(-1);
                                objEdge1.SetMultiCase(v12_mul);
                                objEdge2.SetMultiCase(v12_mul);

                                m_aEdgeData.push(objEdge1);
                                m_aEdgeData.push(objEdge2);

                                if (m_aVertexData[iv1].GetEdgeID() === -1) {

                                    m_aVertexData[iv1].SetEdgeID(objEdge1.GetID());
                                }
                            }

                            if (v20_flag) {

                                m_aEdgeData[i20].SetTriangleID(tid);
                                m_aEdgeData[i20].SetNextID(i01);
                            } else {

                                objEdge1 = new Edge();
                                objEdge2 = new Edge();

                                objEdge1.SetVertexID(iv0);
                                objEdge2.SetVertexID(iv2);

                                objEdge1.SetID(m_iEdgeCount);
                                objEdge2.SetPairID(m_iEdgeCount);
                                m_iEdgeCount++;

                                objEdge2.SetID(m_iEdgeCount);
                                objEdge1.SetPairID(m_iEdgeCount);
                                m_iEdgeCount++;

                                objEdge1.SetTriangleID(tid);
                                objEdge2.SetTriangleID(-1);

                                objEdge1.SetNextID(i01);
                                objEdge2.SetNextID(-1);

                                objEdge1.SetMultiCase(v20_mul);
                                objEdge2.SetMultiCase(v20_mul);

                                m_aEdgeData.push(objEdge1);
                                m_aEdgeData.push(objEdge2);

                                if (m_aVertexData[iv2].GetEdgeID() === -1) {

                                    m_aVertexData[iv2].SetEdgeID(objEdge1.GetID());
                                }
                            }

                            m_aTriangles.push(objMeshTriangle);
                        }
                    } else if (aSplitLine[0] === 'g') {

                        m_strGroupName = aSplitLine[1];
                    }

                    m_iGroupCount = m_aGroupData.length;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Function creates a new group of vertices.
            var m_functionAddToGroup = function (iTID, strGroupName) {

                for (var i=0; i<m_aGroupData.length; i++) {

                    if (strGroupName === m_aGroupData[i].GetGroupName()) {

                        m_aGroupData[i].AddTID(iTID);
                        return;
                    }
                }

                var faceGroup = new FaceGroup();
                faceGroup.SetGroupName(strGroupName);
                faceGroup.AddTID(iTID);
                m_aGroupData.push(faceGroup);
            };

            /////////////////////////////
            // Private Fields

            // Vertex
            var m_iVertexCount = 0;
            var m_aVertexData = [];

            // Normal
            var m_iNormalCount = 0;
            var m_aNormalData = [];

            // Triangles
            var m_aTriangles = [];
            var m_iTriangleCount = 0;

            // Edge
            var m_aEdgeData = [];
            var m_iEdgeCount = 0;

            // Groups
            var m_aGroupData = [];
            var m_iGroupCount = 0;
            var m_strGroupName = "default";

            // Callback function to be invoked after
            // processing of file is completed.
            var m_callback = null;

            // Boolean indicator for normal calculation
            var m_bCalculateNormals = false;
        };

        // Return a new singleton instance.
        return new functionRet();
    });



