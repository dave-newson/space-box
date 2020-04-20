import socket
from microdotphat import fill, write_string, set_decimal, clear, show

# Config
addr = '0.0.0.0'
port = 12344

# Socket setup
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((addr, port))

# Boot flash
clear()
fill(1)
show()
time.sleep(1)
clear()
show()

print "Listening for UDP packets on ",addr,":",port

while True:

    # Decode received packets
    data,addr = s.recvfrom(1024)

    print addr,"< ",data

    # Microdot update
    clear()
    write_string(data, kerning=False)
    show()
