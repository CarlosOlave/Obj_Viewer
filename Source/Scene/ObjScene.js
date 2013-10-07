/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/29/13
 * Time: 5:10 PM
 */

"use strict";

define(["Scene/Structure/HalfEdgeMesh",
    "Render/Renderer"],
    function(HalfEdgeMesh,
             Renderer) {

        // Return a new instantiated version of object scene.
        var functionRet = function ObjScene() {

            // Closure.
            var self = this;

            //////////////////////////////////
            // Public functions.

            // Generate .obj scene.
            self.ProcessInputFile = function (file) {

                // Construct the half edge data structure
                // that is scene is made up.
                HalfEdgeMesh.ReadFile(file,
                    m_functionPostProcessInputFile);
            };

            // Returns collection of triangles.
            self.GetTriangleCollection = function () {

                return m_aTriangleCollection;
            };

            //////////////////////////////////
            // Private functions.

            // Post processing callback function.
            var m_functionPostProcessInputFile = function (objHalfEdgeMesh) {

                try {

                    if (HalfEdgeMesh.CalculateNormalsInd()) {

                        HalfEdgeMesh.SetNormals();
                    }

                    var iGroupCount = HalfEdgeMesh.GetGroupCount();
                    var iTID;
                    var iEdgeID;
                    var iStartEdgeID;
                    var iCount;
                    var iVertexID;
                    var iNormalID;
                    var aPointNormal = [];
                    var aPoint = [];
                    var aPointNormalCollection = [];
                    var aPointCollection = [];

                    for (var i=0; i<iGroupCount; i++) {           //1

                        var iTIDCount = HalfEdgeMesh.GetGroupAt(i).GetTIDCount();
                        for (var k=0; k<iTIDCount; k++) {     //4

                            iTID = HalfEdgeMesh.GetGroupAt(i).GetTIDAt(k);

                            iEdgeID = HalfEdgeMesh.GetTriangleAt(iTID).GetEdgeID();
                            iStartEdgeID = iEdgeID;
                            iCount = 0;

                            do {

                                iVertexID = HalfEdgeMesh.GetEdgeAt(iEdgeID).GetVertexID();
                                iNormalID = HalfEdgeMesh.GetTriangleAt(iTID).GetNormalIDAt(iCount);

                                if (iNormalID === -1) {

                                    aPointNormal.push(HalfEdgeMesh.GetVertexAt(iVertexID).GetNormalValueAt(0));
                                    aPointNormal.push(HalfEdgeMesh.GetVertexAt(iVertexID).GetNormalValueAt(1));
                                    aPointNormal.push(HalfEdgeMesh.GetVertexAt(iVertexID).GetNormalValueAt(2));
                                } else {

                                    aPointNormal.push(HalfEdgeMesh.GetNormalAt(iNormalID).GetNormalValueAt(0));
                                    aPointNormal.push(HalfEdgeMesh.GetNormalAt(iNormalID).GetNormalValueAt(1));
                                    aPointNormal.push(HalfEdgeMesh.GetNormalAt(iNormalID).GetNormalValueAt(2));
                                }

                                aPoint.push(HalfEdgeMesh.GetVertexAt(iVertexID).GetPositionValueAt(0));
                                aPoint.push(HalfEdgeMesh.GetVertexAt(iVertexID).GetPositionValueAt(1));
                                aPoint.push(HalfEdgeMesh.GetVertexAt(iVertexID).GetPositionValueAt(2));

                                aPointCollection.push(aPoint);
                                aPointNormalCollection.push(aPointNormal);

                                // Reset arrays.
                                aPoint = [];
                                aPointNormal = [];

                                iCount++;
                                iEdgeID = HalfEdgeMesh.GetEdgeAt(iEdgeID).GetNextID();

                            } while(iEdgeID !== iStartEdgeID)

                            m_functionSetTriangle(aPointCollection, aPointNormalCollection);
                            aPointCollection = [];
                            aPointNormalCollection = [];
                        }
                    }

                    // Test Print.
                    //m_functionPrint();

                    // Create rendered object and pass down the collection
                    // of triangles.
                    Renderer.Initialize(m_aTriangleCollection);
                    Renderer.Start();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Adds a point and normal to the triangle collection.
            var m_functionSetTriangle = function (aPointCollection, aPointNormalCollection) {

                if ((aPointCollection.length !== 3) ||
                    (aPointNormalCollection.length !== 3)) {

                    return;
                }

                var aV0 = aPointCollection[0];
                var aV1 = aPointCollection[1];
                var aV2 = aPointCollection[2];

                var aVn0 = aPointNormalCollection[0];
                var aVn1 = aPointNormalCollection[1];
                var aVn2 = aPointNormalCollection[2];

                //m_functionSinglePrint(aV2,
                //    aV0, aV1, aVn2, aVn0, aVn1);

                // Construct a generic object consisting of
                // vertices (v1, v2, v3) and vertices normals (vn1, vn2, vn3)
                m_aTriangleCollection.push(
                    {
                        v1 : aV2,
                        v2 : aV0,
                        v3 : aV1,
                        vn1 : aVn2,
                        vn2 : aVn0,
                        vn3 : aVn1
                    }
                );
            };

            // Print a triangle.
            var m_functionSinglePrint = function (v1,
                v2, v3, vn1, vn2, vn3) {

                console.log(v1[0] + "," + v1[1] + "," + v1[2] + "," +
                    "0,1,0,1," +
                    vn1[0] + ", " + vn1[1] + ", " + vn1[2] + ",1.0, 1.0");

                console.log(v2[0] + "," + v2[1] + "," + v2[2] + "," +
                    "0,1,0,1," +
                    vn2[0] + ", " + vn2[1] + ", " + vn2[2] + ",1.0, 1.0");

                console.log(v3[0] + "," + v3[1] + "," + v3[2] + "," +
                    "0,1,0,1," +
                    vn3[0] + "," + vn3[1] + "," + vn3[2] + ",1.0, 1.0");
            };

            // Print collection.
            var m_functionPrint = function () {

                for (var i=0; i<m_aTriangleCollection.length; i++) {

                    var obj = m_aTriangleCollection[i];
                    console.log(obj.v1[0] + "," + obj.v1[1] + "," + obj.v1[2] + "," +
                        "0,1,0,1," +
                        obj.vn1[0] + ", " + obj.vn1[1] + ", " + obj.vn1[2] + ",1.0, 1.0");

                    console.log(obj.v2[0] + "," + obj.v2[1] + "," + obj.v2[2] + "," +
                        "0,1,0,1," +
                        obj.vn2[0] + ", " + obj.vn2[1] + ", " + obj.vn2[2] + ",1.0, 1.0");

                    console.log(obj.v3[0] + "," + obj.v3[1] + "," + obj.v3[2] + "," +
                        "0,1,0,1," +
                        obj.vn3[0] + "," + obj.vn3[1] + "," + obj.vn3[2] + ",1.0, 1.0");
                }

                console.log("---------------------------------------------------");
            };

            //////////////////////////////////
            // Private fields.

            var m_aTriangleCollection = [];
        };

        // Return a new singleton instance.
        return new functionRet();
    });
