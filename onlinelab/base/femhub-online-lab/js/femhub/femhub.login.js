
FEMhub.Login = Ext.extend(Ext.Window, {
    loginHtml: '<div class="femhub-login-head">The FEMhub Online Laboratory</div>' +
               '<div class="femhub-login-text">' +
               'The goal of the FEMhub online lab is to make scientific computing ' +
               'accessible to anyone. No need to be a rocket scientist. No need to ' +
               'own a strong computer or buy expensive software either. Everything ' +
               'takes place inside the web browser window. Yes, the same browser ' +
               'that you use for e-mails or to watch YouTube movies. And yes, you ' +
               'can use your favorite iPhone or iPod. The online lab is backed up ' +
               'with substantial computing power of the <a href="http://unr.edu/"> ' +
               'University of Nevada, Reno</a>, that the University gives you free ' +
               'of charge.</div>',

               // XXX: add more info link (centered) -> window

    constructor: function(config) {
        config = config || {};

        this.addEvents({
            'loginsuccess': true,
        });

        var langs = new Ext.data.ArrayStore({
            fields: ['name', 'code'],
            data: [
                ['English', 'en'],
                //['Polski', 'pl'],
                //['Čeština', 'cz'],
            ],
        });

        var combo = new FEMhub.IconComboBox({
            width: 150,
            mode: 'local',
            store: langs,
            value: 'en',
            displayField: 'name',
            valueField: 'code',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            iconClsPrefix: 'femhub-flag-',
        });

        var login = new Ext.form.FormPanel({
            labelWidth: 65,
            border: false,
            padding: 10,
            items: [{
                id: 'femhub-login-username',
                fieldLabel: 'Username',
                xtype: 'textfield',
                maxLength: 30,
                width: 150,
                listeners: {
                    specialkey: {
                        fn: function(obj, evt) {
                            if (evt.getKey() == evt.ENTER) {
                                Ext.getCmp('femhub-login-password').focus();
                            }
                        },
                        scope: this,
                    },
                },
            }, {
                id: 'femhub-login-password',
                fieldLabel: 'Password',
                xtype: 'textfield',
                inputType: 'password',
                maxLength: 128,
                width: 150,
                listeners: {
                    specialkey: {
                        fn: function(obj, evt) {
                            if (evt.getKey() == evt.ENTER) {
                                this.login();
                            }
                        },
                        scope: this,
                    },
                },
            }, {
                id: 'femhub-login-language',
                fieldLabel: 'Language',
                border: false,
                items: combo,
                width: 150,
            }, {
                id: 'femhub-login-remember',
                xtype: 'checkbox',
                boxLabel: 'remember me',
                checked: true,
            }],
        });

        Ext.apply(config, {
            title: "Welcome to FEMhub Online Lab",
            bodyCssClass: 'femhub-login-body',
            width: 563,
            height: 375,
            layout: 'table',
            layoutConfig: {
                columns: 2,
            },
            closable: false,
            resizable: false,
            items: [
                {
                    html: this.loginHtml,
                    bodyStyle: 'padding: 10px',
                    border: false,
                    width: 300,
                },
                login,
            ],
            buttons: [{
                text: 'Create account',
                minWidth: 110,
                handler: function() {
                    var win = new FEMhub.CreateAccount(this);
                    win.show();
                },
                scope: this,
            }, {
                text: 'Forgot password?',
                minWidth: 110,
                handler: function() {
                    var win = new FEMhub.RemindPassword(this);
                    win.show();
                },
                scope: this,
            }, '-', {
                text: 'Sign In',
                handler: function() {
                    this.login();
                },
                scope: this,
            }],
        });

        FEMhub.Login.superclass.constructor.call(this, config);
    },

    onShow: function() {
        this.focusUsername();
    },

    clearFields: function() {
        Ext.getCmp('femhub-login-username').setValue('');
        Ext.getCmp('femhub-login-password').setValue('');
    },

    focusUsername: function() {
        Ext.getCmp('femhub-login-username').focus();
    },

    setUsername: function(username) {
        Ext.getCmp('femhub-login-username').setValue(username);
    },

    login: function() {
        var username = Ext.getCmp('femhub-login-username');
        var password = Ext.getCmp('femhub-login-password');
        var language = Ext.getCmp('femhub-login-language');
        var remember = Ext.getCmp('femhub-login-remember');

        var params = {
            username: username.getValue(),
            password: password.getValue(),
            remember: remember.getValue(),
        }

        FEMhub.RPC.Account.login(params, function(result) {
            if (result.ok === true) {
                this.fireEvent('loginsuccess');
                this.close();
            } else {
                switch (result.reason) {
                case 'disabled':
                    Ext.MessageBox.show({
                        title: 'Login failed',
                        msg: 'Your account has been disabled.',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING,
                    });
                    break;
                case 'failed':
                    Ext.MessageBox.show({
                        title: 'Login failed',
                        msg: 'You have entered wrong username or password!',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn: function() {
                            this.clearFields();
                            this.focusUsername();
                        },
                        scope: this,
                    });
                    break;
                }
            }
        }, this);
    },
});

FEMhub.CreateAccount = Ext.extend(Ext.Window, {
    constructor: function(login, config) {
        this.login = login;
        config = config || {};

        Ext.apply(config, {
            title: 'Create accout',
            bodyStyle: 'background-color: white',
            padding: 10,
            width: 390,
            autoHeight: true,
            modal: true,
            layout: 'form',
            closable: false,
            resizable: false,
            items: {
                id: 'femhub-create-form',
                xtype: 'form',
                border: false,
                labelWidth: 150,
                defaults: {
                    anchor: '100%',
                },
                items: [{
                    id: 'femhub-create-username',
                    fieldLabel: 'Username',
                    xtype: 'textfield',
                    vtype: 'alphanum',
                    allowBlank: false,
                    blankText: "Choose your username.",
                    maxLength: 30,
                    maxLengthText: "Username must be at most 30 characters long.",
                    validationEvent: false,
                    listeners: {
                        specialkey: {
                            fn: function(obj, evt) {
                                if (evt.getKey() == evt.ENTER) {
                                    Ext.getCmp('femhub-create-email').focus();
                                }
                            },
                            scope: this,
                        },
                    },
                }, {
                    id: 'femhub-create-email',
                    fieldLabel: 'E-mail',
                    xtype: 'textfield',
                    vtype: 'email',
                    allowBlank: false,
                    blankText: "Enter your E-mail.",
                    maxLength: 70,
                    maxLengthText: "E-mail must be at most 70 characters long.",
                    validationEvent: false,
                    listeners: {
                        specialkey: {
                            fn: function(obj, evt) {
                                if (evt.getKey() == evt.ENTER) {
                                    Ext.getCmp('femhub-create-password').focus();
                                }
                            },
                            scope: this,
                        },
                    },
                }, {
                    id: 'femhub-create-password',
                    fieldLabel: 'Choose password',
                    xtype: 'textfield',
                    vtype: 'password',
                    inputType: 'password',
                    allowBlank: false,
                    blankText: "Choose your password.",
                    minLength: 5,
                    minLengthText: "Password must be at least 5 characters long.",
                    maxLength: 128,
                    maxLengthText: "Password must be at most 128 characters long.",
                    validationEvent: false,
                    listeners: {
                        specialkey: {
                            fn: function(obj, evt) {
                                if (evt.getKey() == evt.ENTER) {
                                    Ext.getCmp('femhub-create-password-retype').focus();
                                }
                            },
                            scope: this,
                        },
                    },
                }, {
                    id: 'femhub-create-password-retype',
                    fieldLabel: 'Re-type password',
                    xtype: 'textfield',
                    vtype: 'password',
                    inputType: 'password',
                    allowBlank: false,
                    blankText: "Confirm your password.",
                    minLength: 5,
                    minLengthText: "Password must be at least 5 characters long.",
                    maxLength: 128,
                    maxLengthText: "Password must be at most 128 characters long.",
                    validationEvent: false,
                    listeners: {
                        specialkey: {
                            fn: function(obj, evt) {
                                if (evt.getKey() == evt.ENTER) {
                                    this.createAccount();
                                }
                            },
                            scope: this,
                        },
                    },
                }],
            },
            buttons: [{
                text: 'OK',
                handler: function() {
                    this.createAccount();
                },
                scope: this,
            }, {
                text: 'Cancel',
                handler: function() {
                    this.closeAndReturn();
                },
                scope: this,
            }],
        });

        FEMhub.CreateAccount.superclass.constructor.call(this, config);
    },

    onShow: function() {
        this.focusUsername();
    },

    focusUsername: function() {
        Ext.getCmp('femhub-create-username').focus();
    },

    clearFields: function() {
        Ext.getCmp('femhub-create-username').setValue('');
        Ext.getCmp('femhub-create-email').setValue('');
        Ext.getCmp('femhub-create-password').setValue('');
        Ext.getCmp('femhub-create-password-retype').setValue('');
    },

    createAccount: function() {
        var form = Ext.getCmp('femhub-create-form').getForm();

        if (!form.isValid()) {
            return;
        }

        var username = Ext.getCmp('femhub-create-username');
        var email = Ext.getCmp('femhub-create-email');
        var password = Ext.getCmp('femhub-create-password');
        var passwordRetype = Ext.getCmp('femhub-create-password-retype');

        var params = {
            username: username.getValue(),
            email: email.getValue(),
            password: password.getValue(),
        }

        if (params.password != passwordRetype.getValue()) {
            Ext.MessageBox.show({
                title: 'Account creation failed',
                msg: "Passwords don't match, please fix this.",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR,
                fn: function(button) {
                    Ext.getCmp('femhub-create-password-retype').setValue('');
                },
                scope: this,
            });
        } else {
            FEMhub.RPC.Account.createAccount(params, function(result) {
                if (result.ok === true) {
                    this.login.setUsername(params.username);
                    this.closeAndReturn();
                } else {
                    if (result.reason === 'exists') {
                        Ext.MessageBox.show({
                            title: 'Account creation failed',
                            msg: "'" + params.username + "' is already in use. Choose different username.",
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            fn: function(button) {
                                Ext.getCmp('femhub-create-username').setValue('');
                            },
                            scope: this,
                        });
                    } else {
                        this.clearFields();
                    }
                }
            }, this);
        }
    },

    closeAndReturn: function() {
        this.close();
    },
});

FEMhub.RemindPassword = Ext.extend(Ext.Window, {
    constructor: function(login, config) {
        this.login = login;
        config = config || {};

        Ext.apply(config, {
            title: 'Remind password',
            bodyStyle: 'background-color: white',
            padding: 10,
            width: 340,
            autoHeight: true,
            modal: true,
            layout: 'form',
            closable: false,
            resizable: false,
            items: {
                id: 'femhub-remind-form',
                xtype: 'form',
                border: false,
                labelWidth: 150,
                defaults: {
                    anchor: '100%',
                },
                items: [{
                    id: 'femhub-remind-username',
                    fieldLabel: 'Username',
                    xtype: 'textfield',
                    vtype: 'alphanum',
                    allowBlank: false,
                    blankText: "Choose your username.",
                    maxLength: 30,
                    maxLengthText: "Username must be at most 30 characters long.",
                    validationEvent: false,
                    listeners: {
                        specialkey: {
                            fn: function(obj, evt) {
                                if (evt.getKey() == evt.ENTER) {
                                    this.remindPassword();
                                }
                            },
                            scope: this,
                        },
                    },
                }],
            },
            buttons: [{
                text: 'OK',
                handler: function() {
                    this.remindPassword();
                },
                scope: this,
            }, {
                text: 'Cancel',
                handler: function() {
                    this.closeAndReturn();
                },
                scope: this,
            }],
        });

        FEMhub.RemindPassword.superclass.constructor.call(this, config);
    },

    onShow: function() {
        this.focusUsername();
    },

    clearFields: function() {
        Ext.getCmp('femhub-remind-username').setValue('');
    },

    focusUsername: function() {
        Ext.getCmp('femhub-remind-username').focus();
    },

    remindPassword: function() {
        var form = Ext.getCmp('femhub-remind-form').getForm();

        if (!form.isValid()) {
            return;
        }

        var username = Ext.getCmp('femhub-remind-username');

        var params = {
            username: username.getValue(),
        }

        FEMhub.RPC.Account.remindPassword(params, function(result) {
            if (result.ok === true) {
                Ext.MessageBox.show({
                    title: 'Remind password',
                    msg: "New password was sent to your E-mail account.",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function(button) {
                        if (button === 'ok') {
                            this.login.setUsername(params.username);
                            this.closeAndReturn();
                        }
                    },
                    scope: this,
                });
            } else {
                if (result.reason === 'does-not-exist') {
                    Ext.MessageBox.show({
                        title: 'Remind password',
                        msg: "'" + params.username + "' account does not exists. Choose a correct one.",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                    });
                } else {
                    /* should not happen */
                }

                this.clearFields();
            }
        }, this);
    },

    closeAndReturn: function() {
        this.close();
    },
});

FEMhub.Modules.Logout = Ext.extend(FEMhub.Module, {
    launcher: {
        text: 'Logout',
        icon: 'femhub-logout-launcher-icon',
    },
    start: function() {
        Ext.MessageBox.show({
            title: 'Logout',
            msg: 'Do you really want to logout from FEMhub Online Lab?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(button) {
                if (button === 'yes') {
                    FEMhub.RPC.Account.logout({}, function() {
                        FEMhub.lab.restartLab();
                    }, this);
                }
            },
        });
    },
});

