/**
 * Gère le partage du portfolio sur différentes plateformes
 * 
 * @param {string} platform - La plateforme de partage
 * @param {Object} translations - Les traductions actuelles
 * @param {Function} setShowShareMenu - Fonction pour masquer le menu de partage
 * @returns {void}
 */
export const handleShare = (platform, translations, setShowShareMenu) => {
    const url = window.location.href;
    const title = translations.shareTitle;
    
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert(translations.copiedLink);
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };