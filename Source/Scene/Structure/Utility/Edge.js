/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/28/13
 * Time: 11:12 PM
 */

"use strict";

define([],
    function() {

        var functionRet = function Edge() {

            // Closure.
            var self = this;

            /////////////////////////////////////
            // Public functions.

            // Sets edge pair id.
            self.SetPairID = function (iValue) {

                iPairID = iValue;
            };

            // Sets edge next id.
            self.SetNextID = function (iValue) {

                iNextID = iValue;
            };

            // Sets edge id.
            self.SetID = function (iValue) {

                iID = iValue;
            };

            // Sets edge vertex id.
            self.SetVertexID = function (iValue) {

                iVertexID = iValue;
            };

            // Sets edge triangle id.
            self.SetTriangleID = function (iValue) {

                iTriangleID = iValue;
            };

            // Sets edge multi case.
            self.SetMultiCase = function (iValue) {

                iMultiCase = iValue;
            };

            /** @return int */
            self.GetPairID = function () {

                return iPairID;
            };

            /** @return int */
            self.GetNextID = function () {

                return iNextID;
            };

            /** @return int */
            self.GetID = function () {

                return iID;
            };

            /** @return int */
            self.GetVertexID = function () {

                return iVertexID;
            };

            /** @return int */
            self.GetTriangleID = function () {

                return iTriangleID;
            };

            /** @return int */
            self.GetMultiCase = function () {

                return iMultiCase;
            };

            //////////////////////////////////////
            // Private Fields

            var iPairID = -1;
            var iNextID = -1;
            var iID = -1;
            var iVertexID = -1;
            var iTriangleID = -1;
            var iMultiCase = -1;
        };

        return functionRet;
    });