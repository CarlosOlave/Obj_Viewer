/**
 * Created with JetBrains WebStorm.
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/26/13
 * Time: 11:51 PM
 */

"use strict";

define([],
    function () {

        try {

            ///////////////////////////////////////
            // Functions

            // Extends Function's prototype to support OOP.
            Function.prototype.inherits = function (ParentConstructorFunction) {

                // Set the prototype for "this" function.
                // This injects ParentConstructorFunction
                // into "this", which is another function.
                this.prototype = new ParentConstructorFunction();

                // Also set the prototype's constructor to this.
                // This has the effect of circumventing some
                // behavior of JavaScript which would otherwise
                // cause problems for the new this.prototype.
                this.prototype.constructor = this;
            };

            ///////////////////////////////////////
            // Object

            // Extend on array native implementation
            Array.prototype.clean = function(deleteToken) {

                for (var i = 0; i < this.length; i++) {

                    if (this[i] === deleteToken) {
                        this.splice(i, 1);
                        i--;
                    }
                }
                return this;
            };

            // Merges the function parameter's properties into "this".
            Object.defineProperty(Object.prototype,
                "extender", {

                    value: function (objectSource) {

                        // Define recursive object merger.
                        var functionMerge = function (objectTarget,
                                                      objectSource) {

                            // Null or Undefined then simple
                            // return target object.
                            if (objectSource === undefined ||
                                objectSource === null) {

                                return objectTarget;
                            }

                            // Must handle arrays and objects differently.
                            if (objectSource instanceof Array) {

                                // Loop over all source items.
                                for (var i = 0; i < objectSource.length; i++) {

                                    if (objectTarget.length > i) {

                                        // Recurse down.
                                        functionMerge(objectTarget[i],
                                            objectSource[i]);
                                    } else {

                                        objectTarget.push(objectSource[i]);
                                    }
                                }
                            } else if (objectSource instanceof Object) {

                                // Loop over all source properties.
                                for (var strKey in objectSource) {

                                    // Do not handle base properties.
                                    if (objectSource.hasOwnProperty(strKey) === false) {

                                        continue;
                                    }

                                    // If the target does not have a source property, add, else...
                                    if (objectTarget[strKey] === undefined) {

                                        objectTarget[strKey] = objectSource[strKey];
                                    } else {

                                        // Recurse down if object or array, otherwise assign.

                                        if (objectTarget[strKey] instanceof Array ||
                                            objectTarget[strKey] instanceof Object) {

                                            // Recurse down.
                                            functionMerge(objectTarget[strKey],
                                                objectSource[strKey]);
                                        } else {

                                            // Even though target has a value here, need
                                            // To over-write since the type is a kernel.
                                            objectTarget[strKey] = objectSource[strKey];
                                        }
                                    }
                                }
                            } else { // Kernel type

                                objectTarget = objectSource;
                            }

                            // Return the target for chaining purposes.
                            return objectTarget;
                        };

                        // Invoke merger function with this and specified object.
                        return functionMerge(this,
                            objectSource);
                    },
                    enumerable: false
                });

        } catch (e) {

            alert(e.message);
        }
    });
