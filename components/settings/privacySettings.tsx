import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

function privacySettings({ userDetails, userInfo } : any) {

    return (
        <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Privacy Settings</h2>
        </div>
    )
}

export default privacySettings;