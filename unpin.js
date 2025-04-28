Java.perform(function () {
    console.log("[*] Starting SSL pinning bypass for Android 13...");

    // Convert certificate array to List
    var ArrayList = Java.use("java.util.ArrayList");
    var Collections = Java.use("java.util.Collections");

    // Hook TrustManagerImpl (Conscrypt) with specific overloads
    try {
        var TrustManagerImpl = Java.use("com.android.org.conscrypt.TrustManagerImpl");
        TrustManagerImpl.checkTrusted.overload('[Ljava.security.cert.X509Certificate;', 'java.lang.String', 'javax.net.ssl.SSLSession', 'javax.net.ssl.SSLParameters', 'boolean').implementation = function (chain, authType, session, params, clientAuth) {
            console.log("[*] Bypassing TrustManagerImpl.checkTrusted (Session-based) for host: " + (session.getPeerHost ? session.getPeerHost() : "unknown"));
            var list = ArrayList.$new();
            Collections.addAll(list, chain);
            return list;
        };
        TrustManagerImpl.checkTrusted.overload('[Ljava.security.cert.X509Certificate;', '[B', '[B', 'java.lang.String', 'java.lang.String', 'boolean').implementation = function (chain, authTypeBytes, issuerBytes, host, authType, clientAuth) {
            console.log("[*] Bypassing TrustManagerImpl.checkTrusted (Raw data) for host: " + host);
            var list = ArrayList.$new();
            Collections.addAll(list, chain);
            return list;
        };
        TrustManagerImpl.checkTrustedRecursive.implementation = function (certs, host, clientAuth, untrustedChain, trustAnchorChain, used) {
            console.log("[*] Bypassing TrustManagerImpl.checkTrustedRecursive for host: " + host);
            return certs; // Already a List in this context
        };
    } catch (e) {
        console.log("[*] TrustManagerImpl error: " + e);
    }

    // Hook X509TrustManager (generic fallback)
    try {
        var X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");
        X509TrustManager.checkServerTrusted.implementation = function (chain, authType) {
            console.log("[*] Bypassing X509TrustManager.checkServerTrusted for host: " + Java.use("javax.net.ssl.SSLContext").getDefault().getDefaultSSLParameters().getServerNames());
            return;
        };
        X509TrustManager.checkClientTrusted.implementation = function (chain, authType) {
            console.log("[*] Bypassing X509TrustManager.checkClientTrusted");
            return;
        };
    } catch (e) {
        console.log("[*] X509TrustManager not found: " + e);
    }

    // Hook HostnameVerifier (for additional hostname checks)
    try {
        var HostnameVerifier = Java.use("javax.net.ssl.HostnameVerifier");
        HostnameVerifier.verify.overload("java.lang.String", "javax.net.ssl.SSLSession").implementation = function (hostname, session) {
            console.log("[*] Bypassing HostnameVerifier for: " + hostname);
            return true;
        };
    } catch (e) {
        console.log("[*] HostnameVerifier not found: " + e);
    }
});
