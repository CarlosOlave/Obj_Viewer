/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/28/13
 * Time: 9:34 PM
 */

"use strict";

define([],
    function() {

        var functionRet = function Vertex(aVertexPosition, iVertexID) {

            // Closure.
            var self = this;

            //////////////////////////////////
            // Public functions.

            // Returns vertex position array.
            self.GetPosition = function () {

                return m_aPosition;
            };

            // Returns vertex ID.
            self.GetID = function () {

                return m_iID;
            };

            // Returns vertex normal array.
            self.GetNormal = function () {

                return m_aNormal;
            };

            // Returns a vertex normal value at a specific index location.
            self.GetNormalValueAt = function (iIndex) {

                return m_aNormal[iIndex];
            };

            // Returns a vertex position value at a specific index location.
            self.GetPositionValueAt = function (iIndex) {

                return m_aPosition[iIndex];
            };

            // Returns indicator if this vectors has normals.
            /** @return  Boolean */
            self.GetHasNormalInd = function () {

                return m_bHasNormal;
            };

            // Returns vertex edge ID.
            /** @return int */
            self.GetEdgeID = function () {

                return m_iEdgeID;
            };

            // Sets vertex normal.
            self.SetNormal = function (aVertexNormal) {

                m_bHasNormal = true;
                m_aNormal = aVertexNormal;
            };

            // Sets vertex edge ID.
            self.SetEdgeID = function (iVertexEdgeID) {

                m_iEdgeID = iVertexEdgeID;
            };

            ////////////////////////////////////
            // Private fields

            var m_aPosition = aVertexPosition;
            var m_iID = iVertexID;
            var m_bHasNormal = false;
            var m_iEdgeID = -1;
            var m_aNormal;
        };

        return functionRet;
    });