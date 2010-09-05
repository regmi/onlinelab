#! /usr/bin/python

def run_lab_new():
    import os
    from subprocess import Popen, PIPE
    sagelocal = os.getenv("SAGE_LOCAL")
    path_backend = sagelocal + "/lib/python2.6/site-packages/onlinelab/bin/run-backend"
    path_frontend = sagelocal + "/lib/python2.6/site-packages/onlinelab/bin/run-frontend"

    process_backend = Popen([path_backend,])
    process_frontend = Popen([path_frontend,])
    #process_backend = Popen([path_backend,], stdout=PIPE)
    #process_frontend = Popen([path_frontend,], stdout=PIPE)

    print "FEMhub Online Lab is running now. Point your browser to
    http://localhost:9000/ to login."
    print "Press Ctrl+c to terminate the processes associated with the FEMhub Online Lab
    press Ctrl+c."

    #process_frontend.wait()
    process_frontend.communicate()[0]
    process_frontend.communicate()[0]
