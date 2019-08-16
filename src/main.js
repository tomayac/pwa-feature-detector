((win, doc, nav) => {
  const detectFeatures = (registration) => {
    return {
      'Offline Capabilities': 'caches' in win,
      'Push Notifications': 'pushManager' in registration,
      'Add to Home Screen': 'relList' in HTMLLinkElement.prototype &&
          doc.createElement('link').relList.supports('manifest') &&
          'onbeforeinstallprompt' in win,
      'Background Sync': 'sync' in registration,
      'Periodic Background Sync': 'periodicSync' in registration,
      'Navigation Preload': 'navigationPreload' in registration,
      'Storage Estimation': 'storage' in nav && 'estimate' in nav.storage,
      'Persistent Storage': 'storage' in nav && 'persist' in nav.storage,
      'Web Share': 'share' in nav,
      'Media Session': 'mediaSession' in nav,
      'Media Capabilities': 'mediaCapabilities' in nav,
      'Device Memory': 'deviceMemory' in nav,
      'Getting Installed Related Apps': 'getInstalledRelatedApps' in nav,
      'Payment Request': 'PaymentRequest' in win,
      'Payment Handler': 'paymentManager' in registration,
      'Credential Management': 'credentials' in nav &&
          'preventSilentAccess' in nav.credentials &&
          ('PasswordCredential' in win || 'FederatedCredential' in win),
    };
  };

  const updateUserInterface = (pwaFeatures) => {
    const fragment = doc.createDocumentFragment();
    const featureRow = doc.getElementById('featureRow');
    const featureCell = featureRow.content.querySelector('.feature');
    const supportCell = featureRow.content.querySelector('.support');
    for (const feature in pwaFeatures) {
      if (!pwaFeatures.hasOwnProperty(feature)) {
        continue;
      }
      featureCell.textContent = feature;
      supportCell.textContent = pwaFeatures[feature] ? '✅' : '❌';
      fragment.appendChild(doc.importNode(featureRow.content, true));
    }
    const placeholder = doc.getElementById('placeholder');
    placeholder.parentNode.replaceChild(fragment, placeholder);
  };

  win.addEventListener('load', () => {
    doc.getElementById('userAgent').textContent = nav.userAgent;
    win.setTimeout(() => {
      if ('serviceWorker' in nav) {
        return nav.serviceWorker.register('sw.min.js')
            .then((registration) => {
              const pwaFeatures = detectFeatures(registration);
              updateUserInterface(pwaFeatures);
            });
      }
      updateUserInterface({'Service Workers Not Supported': false});
    }, 500);
  });
})(window, document, navigator);
