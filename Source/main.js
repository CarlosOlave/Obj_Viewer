/**
 * Created with JetBrains WebStorm.
 * User: Carlos Olave (Mr. Peru)
 * Date: 9/26/13
 * Time: 11:37 PM
 */

"use strict";

require(["prototypes",
    "app"],
    function (prototypes,
              app) {

        try {

            // Just initialize the application.
            var exceptionRet = app.initialize();
            if (exceptionRet !== null) {

                alert(exceptionRet);
            }
        } catch (e) {

            alert(e.message);
        }
    });
