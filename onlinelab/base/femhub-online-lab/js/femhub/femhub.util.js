
FEMhub.util = {};

FEMhub.util.isValidName = function(name) {
    var len = name.trim().length;
    return len > 0 && len < 100;
}

FEMhub.util.rfc = {};

FEMhub.util.rfc.UUID = function() {
    var uuid = [], hex = '0123456789ABCDEF';

    for (var i = 0; i < 36; i++) {
        uuid[i] = Math.floor(0x10*Math.random());
    }

    uuid[14] = 4;
    uuid[19] = (uuid[19] & 0x3) | 0x8;

    for (var i = 0; i < 36; i++) {
        uuid[i] = hex[uuid[i]];
    }

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';

    return uuid.join('');
}

FEMhub.util.UUID = function() {
    return FEMhub.util.rfc.UUID().replace(/-/g, '');
}

