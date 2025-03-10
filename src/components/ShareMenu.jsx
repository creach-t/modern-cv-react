import React from "react";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Phone, 
  Link2 
} from "lucide-react";

const ShareMenu = ({ handleShare, isMobile, setShowShareMenu }) => (
  <>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50"
      style={{ color: "black" }}
    >
      <div className="py-1">
        <button 
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          onClick={() => handleShare('facebook')}
        >
          <Facebook className="w-5 h-5 text-blue-600" />
          <span>Facebook</span>
        </button>
        <button 
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="w-5 h-5 text-blue-400" />
          <span>Twitter</span>
        </button>
        <button 
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          onClick={() => handleShare('linkedin')}
        >
          <Linkedin className="w-5 h-5 text-blue-700" />
          <span>LinkedIn</span>
        </button>
        <button 
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          onClick={() => handleShare('whatsapp')}
        >
          <MessageCircle className="w-5 h-5 text-green-500" />
          <span>WhatsApp</span>
        </button>
        {isMobile && (
          <button 
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => handleShare('sms')}
          >
            <Phone className="w-5 h-5 text-gray-600" />
            <span>SMS</span>
          </button>
        )}
        <button 
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          onClick={() => handleShare('copy')}
        >
          <Link2 className="w-5 h-5 text-gray-600" />
          <span>Copier le lien</span>
        </button>
      </div>
    </motion.div>
    
    {/* Overlay pour fermer le menu de partage */}
    <div 
      className="fixed inset-0 z-40"
      onClick={() => setShowShareMenu(false)}
    ></div>
  </>
);

export default ShareMenu;