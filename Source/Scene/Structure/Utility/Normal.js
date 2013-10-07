/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/28/13
 * Time: 10:29 PM
 */

"use strict";

define([],
    function() {

        var functionRet = function Normal(aVertexNormal, iVertexNormalID) {

            // Closure.
            var self = this;

            /////////////////////////
            // Public functions.

            // Returns the vertex normal array.
            self.GetNormal = function () {

                return m_aNormal;
            };

            // Returns the vertex normal ID.
            self.GetID = function () {

                return m_iID;
            };

            // Returns a normal value at a specific index location.
            self.GetNormalValueAt = function (iIndex) {

                return m_aNormal[iIndex];
            };

            ///////////////////////////////////
            // Private fields

            var m_aNormal = aVertexNormal;
            var m_iID = iVertexNormalID;
        };

        return functionRet;
    });