# Prototype Microdot pHat Adapter using TCP.

import socket
from microdotphat import write_string, set_decimal, clear, show

# Config
addr = '0.0.0.0'
port = 12344

# Socket setup
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((addr, port))
s.listen(5)

# Boot flash
clear()
fill(1)
show()
time.sleep(1)
clear()
show()

print "Listening for a connection on ",addr,":",port

while True:

    # Accept connection
    c, addr = s.accept();
    print "Connected: ",addr

    # Decode received data
    rcvdData = c.recv(1024).decode('utf-8')
    print "< ",rcvdData

    # Microdot update
    clear()
    write_string(rcvdData, kerning=False)
    show()

    # Close connection
    c.close();