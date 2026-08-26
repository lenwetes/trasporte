"use client";

import * as React from "react";
import { LicenciaTabProps } from "../licencia-tab.types";
import { useLicenciaTab } from "../use-licencia-tab";
import { LicenciaActionBar } from "./licencia-action-bar";
import { LicenciaIdentityCard } from "./licencia-identity-card";
import { LicenciaSupportView } from "./licencia-support-view";
import { LicenciaDigitizeWizard } from "./licencia-digitize-wizard";

export function LicenciaTabRoot(props: LicenciaTabProps) {
    const {
        displayFile,
        isDeletingFile,
        isUploading,
        isDigitizeModalOpen,
        setIsDigitizeModalOpen,
        step,
        setStep,
        numLicencia,
        setNumLicencia,
        tempCategories,
        addTempCategory,
        removeTempCategory,
        updateTempCategory,
        fileInputRef,
        handleFileUpload,
        handleDeleteSoporte,
        handleFinalSync,
        startWizard,
        uploadedFileId
    } = useLicenciaTab(props);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <LicenciaActionBar startWizard={startWizard} />

            <LicenciaIdentityCard conductor={props.conductor} />

            <LicenciaSupportView 
                displayFile={displayFile}
                handleDeleteSoporte={handleDeleteSoporte}
                isDeletingFile={isDeletingFile}
            />

            <LicenciaDigitizeWizard 
                isOpen={isDigitizeModalOpen}
                onOpenChange={setIsDigitizeModalOpen}
                step={step}
                setStep={setStep}
                numLicencia={numLicencia}
                setNumLicencia={setNumLicencia}
                tempCategories={tempCategories}
                addTempCategory={addTempCategory}
                removeTempCategory={removeTempCategory}
                updateTempCategory={updateTempCategory}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                handleFinalSync={handleFinalSync}
                isUploading={isUploading}
                uploadedFileId={uploadedFileId}
            />
        </div>
    );
}
