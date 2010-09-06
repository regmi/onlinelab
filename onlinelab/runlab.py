#! /usr/bin/python

def run_lab_new():
    """
    Starts the frontend and backend servers of the FEMhub Online Numerical
    Methods Laboratory.
    """

    # Import necessary modules
    import os
    from subprocess import Popen

    # Get the variable "SAGE_LOCAL"
    sagelocal = os.getenv("SAGE_LOCAL")

    # Construct the paths to the scripts run-backend and run-frontend
    path_backend = sagelocal + "/lib/python2.6/site-packages/onlinelab/bin/run-backend"
    path_frontend = sagelocal + "/lib/python2.6/site-packages/onlinelab/bin/run-frontend"

    # Create instances of the processes for run-backend and run-frontend
    process_backend = Popen([path_backend,])
    process_frontend = Popen([path_frontend,])

    # Print messages
    print "Welcome to FEMhub Online Numerical Methods Laboratory."
    print "Point your browser to http://localhost:9000/ to login."
    print "Press Ctrl+C to close the FEMhub Online Lab."
    print

    # Interact with the processes and handle Ctrl-C
    try:
        process_backend.communicate()[0]
        process_frontend.communicate()[0]
        print
    except KeyboardInterrupt:
        process_backend.terminate()
        process_frontend.terminate()
        print
