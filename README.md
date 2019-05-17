# NES-IDE

Development for games on the Nintendo Entertainment System can be difficult. This project provides a development and testing environment to make the creation process much easier. It features a palette, tile, and code editor alongside a project based system. These projects can be created, saved, and reopened to begin and continue progess. 

This project uses NodeJS as a local server to communicate between the web app UI and UNIX operating system (Windows support will be a future goal) to allow for the saving and running of projects. The project is packaged with NESASM to generate a binary .nes rom when 'Run Project' is pressed on the UI. By having the NES emulator FCEUX installed, the project will run the .nes file to which allows the programmer to test the game they created.

To use the app, the latest version of NodeJS must be installed so the local server can be started by running 'node main.js'. This will start the server on localhost:11111. After navigating to the app on a web browser, going to File -> New Project will create a project in the NES-IDE folder.
