# GNSS_SDR_webpage
This is a web aplication for the capture (with SDRs) and posterior processing of GNSS signals.

# Com executar el codi

Recomano crear 2 terminals, una per al frontend i una per al backend

# FRONTEND
'''
cd interface_poc_sdr
vue serve
'''
# BACKEND
'''
cd server
node app.js
'''


# Possibles problemes que et pots trobar

1) FRONTEND: Error al executar vue serve per primer cop

  Error (error llarg a la terminal):
    '''
      sh: 1: vue-cli-service: not found
      /home/jmoran/.nvm/versions/node/v20.17.0/lib/node_modules/@vue/cli/node_modules/execa/index.js:174
                err = new Error(`Command failed: ${joinedCmd}${output}`);
                      ^

      Error: Command failed: npm run serve
          at makeError ...
          at ...
          at async ...
          at process ...
        code: 127,
        stdout: null,
        stderr: null,
        failed: true,
        signal: null,
        cmd: 'npm run serve',
        timedOut: false,
        killed: false
      }

    '''

  Solució (comanda terminal): npm i @vue/cli-service


2) BACKEND: Error al importar mòduls

  Error: Cannot find module 'express'
  Solució (comanda terminal): npm install express

3) Port ocupat: Error de comunicació entre el frontend i el backend degut a que un dels ports està ocupat

  Solució (comanda terminal): fuser -k 8080/tcp


# Contacte:

Jan Moran Ricardo (jan.moran@autonoma.cat)