"use client";

import * as React from "react";
import { SimitUpdateModuleProps } from "../simit-update-module.types";
import { useSimitUpdate } from "../use-simit-update";
import { SimitSelectionPanel } from "./simit-selection-panel";
import { SimitResultsPanel } from "./simit-results-panel";
import { SimitHistoryPanel } from "./simit-history-panel";

export function SimitUpdateModuleRoot(props: SimitUpdateModuleProps) {
    const {
        selectedId,
        setSelectedId,
        selectedType,
        setSelectedType,
        isLoading,
        result,
        setResult,
        history,
        showHistory,
        isServerDown,
        handleCheck,
        toggleHistory
    } = useSimitUpdate(props);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <SimitSelectionPanel 
                {...props}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                handleCheck={handleCheck}
                isLoading={isLoading}
                showHistory={showHistory}
                toggleHistory={toggleHistory}
                setResult={setResult}
            />

            <SimitResultsPanel 
                isLoading={isLoading}
                isServerDown={isServerDown}
                result={result}
                handleCheck={handleCheck}
            />

            <SimitHistoryPanel 
                history={history}
                showHistory={showHistory}
            />
        </div>
    );
}
