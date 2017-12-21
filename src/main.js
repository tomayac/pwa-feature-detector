((win, doc, nav) => {
  const detectFeatures = (registration) => {
    return {
      'Offline Capabilities': 'caches' in win,
      'Push Notifications': 'pushManager' in registration,
      'Add to Home Screen': 'BeforeInstallPromptEvent' in win,
      'Background Sync': 'sync' in registration,
      'Navigation Preload': 'navigationPreload' in registration,
      'Budget API': 'budget' in nav && 'reserve' in nav.budget,
      'Storage Estimation': 'storage' in nav && 'estimate' in nav.storage,
      'Persistent Storage': 'storage' in nav && 'persist' in nav.storage,
      'Web Share': 'share' in nav,
      'Media Session': 'mediaSession' in nav,
      'Media Capabilities': 'mediaCapabilities' in nav,
      'Device Memory': 'deviceMemory' in nav,
      'Getting Installed Related Apps': 'getInstalledRelatedApps' in nav,
      'Payment Request': 'PaymentRequest' in win,
      'Credential Management': 'credentials' in nav,
    };
  };

  const updateUserInterface = (pwaFeatures) => {
    const featuresContainer = doc.getElementById('features');
    const fragment = doc.createDocumentFragment();
    const featureRow = doc.getElementById('featureRow');
    const featureCell = featureRow.content.querySelector('.feature');
    const supportCell = featureRow.content.querySelector('.support');
    for (let feature in pwaFeatures) {
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
        nav.serviceWorker.register('sw.min.js')
        .then(registration => {
          const pwaFeatures = detectFeatures(registration);
          updateUserInterface(pwaFeatures);
        });
      }
    }, 1000);
  });
})(window, document, navigator);