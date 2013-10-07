/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/29/13
 * Time: 2:14 AM
 */

"use strict";

define([],
    function() {

        var functionRet = function MeshTriangle() {

            // Closure.
            var self = this;

            //////////////////////////////////
            // Public functions

            // Calculates triangle normal.
            self.CalcFaceNormal = function(v1, v2, v3) {

                var aV1 = v1.GetPosition();
                var aV2 = v2.GetPosition();
                var aV3 = v3.GetPosition();

                // Calculate directional vectors.
                var aDir1 = [0, 0, 0];
                aDir1[0] = aV2[0] - aV1[0];
                aDir1[1] = aV2[1] - aV1[1];
                aDir1[2] = aV2[2] - aV1[2];

                var aDir2 = [0, 0, 0];
                aDir2[0] = aV3[0] - aV1[0];
                aDir2[1] = aV3[1] - aV1[1];
                aDir2[2] = aV3[2] - aV1[2];

                // Calculate cross product.
                var aVn = [0, 0, 0];
                aVn[0] = aDir1[1] * aDir2[2] - aDir1[2] * aDir2[1];
                aVn[1] = aDir1[2] * aDir2[0] - aDir1[0] * aDir2[2];
                aVn[2] = aDir1[0] * aDir2[1] - aDir1[1] * aDir2[0];

                // Normalize vector
                var iLength = Math.sqrt(aVn[0] * aVn[0] +
                    aVn[1] * aVn[1] +
                    aVn[2] * aVn[2]);
                aVn[0] /= iLength;
                aVn[1] /= iLength;
                aVn[2] /= iLength;

                m_aFaceNormal = aVn;
            };

            // Sets the triangle normal.
            self.SetNormal = function (n0, n1, n2, ID) {

                m_aNormalID[0] = n0;
                m_aNormalID[1] = n1;
                m_aNormalID[2] = n2;
                m_iID = ID;
            };

            // Sets the triangle edge ID.
            self.SetEdgeID = function (iValue) {

                m_iEdgeID = iValue;
            };

            // Returns the edge id of this triangle.
            /** @return int */
            self.GetEdgeID = function () {

                return m_iEdgeID;
            };

            // Returns the normal id at a specific index location.
            self.GetNormalIDAt = function (iIndex) {

                return m_aNormalID[iIndex];
            };

            // Returns the face normal vector for this triangle.
            self.GetFaceNormal = function () {

                return m_aFaceNormal;
            };

            // Returns face normal value at a specific index location.
            self.GetFaceNormalValueAt = function (iIndex) {

                return m_aFaceNormal[iIndex];
            };

            //////////////////////////////////
            // Private fields

            var m_iEdgeID = -1;
            var m_aNormalID = [-1, -1, -1];
            var m_iID = -1;
            var strGroup = "";
            var m_aFaceNormal = [-1, -1, -1];
        };

        return functionRet;
    });