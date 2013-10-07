/**
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/29/13
 * Time: 1:00 PM
 */

"use strict";

define([],
    function() {

        var functionRet = function FaceGroup () {

            // Closure.
            var self = this;

            ///////////////////////////////////
            // Public functions

            // Sets the face group name.
            self.SetGroupName = function (strGroupName) {

                m_strGroupName = strGroupName;
            };

            // Adds an id to the face group collection.
            self.AddTID = function (iID) {

                if ((m_aTIDs === undefined) ||
                    (m_aTIDs === null)) {

                    m_aTIDs = [];
                }

                m_aTIDs.push(iID);
            };

            // Returns the TIDs collection.
            self.GetTIDCollection = function () {

                return m_aTIDs;
            };

            // Returns the face group name.
            self.GetGroupName = function () {

                return m_strGroupName;
            };

            // Returns the total count of items in ITDs.
            self.GetTIDCount  = function () {

                return m_aTIDs.length;
            };

            // Returns the TID at a specific index.
            self.GetTIDAt = function (iIndex) {

                return m_aTIDs[iIndex];
            };

            //////////////////////////////////
            // Private Fields.

            var m_strGroupName = "default";
            var m_aTIDs = [];
        };

        return functionRet;
    });