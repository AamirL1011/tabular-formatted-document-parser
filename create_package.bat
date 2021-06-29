set CURDIR=('%cd%')
echo Current directory: %CURDIR%
call docker build --tag layer:latest .
call docker run --rm -v %CURDIR%:/dest layer:latest copy ../package.zip /dest/package.zip


