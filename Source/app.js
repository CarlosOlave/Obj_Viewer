/**
 * Created with JetBrains WebStorm.
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/26/13
 * Time: 11:52 PM
 */

///////////////////////////////////////
// Application seed.

"use strict";

// Require standard modules.
define(["Scene/ObjScene"],
    function (ObjScene) {

        // Return a new instantiated version of the app.
        var functionRet = function App() {

            // Closure
            var self = this;

            ////////////////////////////
            // Public methods.

            // This method is called when the application first runs.
            self.initialize = function () {

                try {

                    // Setup listeners.
                    var dropZone = document.getElementById('drop_zone');
                    dropZone.addEventListener('dragover', m_functionHandleDragOver, false);
                    dropZone.addEventListener('drop', m_functionHandleFileSelect, false);

                   return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            var m_functionHandleDragOver = function (evt) {

                try
                {
                    evt.stopPropagation();
                    evt.preventDefault();
                }
                catch (error)
                {
                    alert(error);
                }
            };

            var m_functionHandleFileSelect = function (evt) {

                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

                // Extract file from list.
                var file = evt.dataTransfer.files[0];

                // Start parsing/rendering file.
                ObjScene.ProcessInputFile(file);
            };
        };

        // Return a new singleton instance.
        return new functionRet();
    });