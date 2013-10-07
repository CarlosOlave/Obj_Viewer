Obj_Viewer
==========

Web application that can be used to view .obj scene files.

Content loaded from external files
==========

If you load models or textures from external files, due to browsers' "same origin policy" security restrictions, 
loading from a file system will fail with a security exception.

There are two ways how to solve this:

Change security for local files in a browser (access page as file:///example)

Run files from a local server (access page as http://localhost/example)

If you use option 1, be aware that you may open yourself to some vulnerabilities if using the same browser for a 
regular web surfing. You may want to create a separate browser profile / shortcut used just for local development to 
be safe.

Chrome Support
==========

Start Chrome executable with a command line flag:

#chrome --allow-file-access-from-files

Run local server
==========

The simplest probably is to use Python's built-in http server.

If you have Python installed, it should be enough to run this from a command line:

# Python 2.x
python -m SimpleHTTPServer
# Python 3.x
python -m http.server
This will serve files from the current directory at localhost under port 8000:

http://localhost:8000/



