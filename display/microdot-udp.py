import socket
import time
from microdotphat import fill, write_string, set_decimal, clear, show

# Config
addr = '0.0.0.0'
port = 12344

# Socket setup
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1)
s.bind((addr, port))
# s.listen(5)

clear()
fill(1)
show()
time.sleep(1)
clear()
show()

print "Listening for a connection on ",addr,":",port

while True:

    # Accept connection
    # c, addr = s.accept();
    # print "Connected: ",addr

    # Decode received data
    data,addr = s.recvfrom(1024)
    
    print addr,"< ",data

    # Microdot update
    clear()
    write_string(data, kerning=False)
    show()

    # Close connection
c.close();
