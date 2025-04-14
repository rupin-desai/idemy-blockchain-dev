import React, { useState } from "react";
import Card from "../ui/Card";
import { RefreshCw } from "lucide-react";
import Button from "../ui/Button";

// Common components
import AlertNotification from "../components/FeaturesTest/AlertNotification";
import TabNavigation from "../components/FeaturesTest/TabNavigation";

// Forms Tab
import TestFormControls from "../components/FeaturesTest/TestFormControls";

// Tables Tab
import TestIdentitiesTable from "../components/FeaturesTest/TestIdentitiesTable";
import TestTablePagination from "../components/FeaturesTest/TestTablePagination";

// Identities Tab
import TestCreateIdentity from "../components/FeaturesTest/TestCreateIdentity";
import TestVerifyIdentity from "../components/FeaturesTest/TestVerifyIdentity";

// Blockchain Tab
import TestBlockchainStatus from "../components/FeaturesTest/TestBlockchainStatus";
import TestContractInteractions from "../components/FeaturesTest/TestContractInteractions";
import TestTransaction from "../components/FeaturesTest/TestTransaction";

// Blockchain Explorer Tab
import TestBlockchainExplorer from "../components/FeaturesTest/TestBlockchainExplorer";

// Blockchain hooks
import useStudentIdentities from "../hooks/useStudentIdentities";
import useBlockchainStatus from "../hooks/useBlockchainStatus";

const TestFeatures = () => {
  const [activeTab, setActiveTab] = useState("blockchain");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  
  // Get blockchain data
  const { loading: blockchainLoading, networkInfo, refreshData: refreshBlockchain } = useBlockchainStatus();
  const { refreshData: refreshIdentities } = useStudentIdentities();

  const showSuccessAlert = (message) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const showErrorAlert = (message) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 8000);
  };

  const handleRefresh = () => {
    refreshBlockchain();
    refreshIdentities();
    showSuccessAlert("Blockchain data refreshed!");
  };

  const handleSubmitSuccess = () => {
    showSuccessAlert("Operation completed successfully!");
  };

  const handleError = (message = "An error occurred. Please try again.") => {
    showErrorAlert(message);
  };

  const handleIdentityCreated = (identity) => {
    showSuccessAlert(`Identity created successfully with DID: ${identity.did}`);
    refreshIdentities();
    setActiveTab("tables"); // Switch to tables to see the new identity
  };

  const handleIdentityVerified = (did) => {
    showSuccessAlert(`Identity ${did} verified on blockchain!`);
    refreshIdentities();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blockchain Test Features</h1>
          <p className="text-gray-600 mt-1">
            Create, verify and manage blockchain identities
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {networkInfo && (
            <div className="text-sm text-gray-500 mr-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              {networkInfo.name} - Block #{networkInfo.blockNumber}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={blockchainLoading}
          >
            <RefreshCw size={14} className={`mr-1 ${blockchainLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <AlertNotification
        show={showAlert}
        type={alertType}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          { id: "blockchain", label: "Blockchain" },
          { id: "explorer", label: "View Blockchain" },
          { id: "identities", label: "Create Identity" },
          { id: "tables", label: "Student Records" },
          { id: "forms", label: "Test Forms" }
        ]}
      />

      {activeTab === "forms" && (
        <TestFormControls
          onSubmitSuccess={handleSubmitSuccess}
          onError={handleError}
        />
      )}

      {activeTab === "tables" && (
        <Card title="Student Identity Records">
          <TestIdentitiesTable 
            onVerifySuccess={handleIdentityVerified}
            onVerifyError={handleError}
          />
          <TestTablePagination
            currentPage={1}
            totalPages={1}
            totalItems={4}
            itemsPerPage={10}
          />
        </Card>
      )}

      {activeTab === "identities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestCreateIdentity 
            onSuccess={handleIdentityCreated} 
            onError={handleError}
          />
          <TestVerifyIdentity 
            onSuccess={handleIdentityVerified} 
            onError={handleError}
          />
        </div>
      )}

      {activeTab === "blockchain" && (
        <Card title="Blockchain Operations">
          <div className="space-y-6">
            <TestBlockchainStatus />
            <TestContractInteractions 
              onSuccess={handleSubmitSuccess}
              onError={handleError}
            />
            <TestTransaction />
          </div>
        </Card>
      )}

      {activeTab === "explorer" && (
        <Card title="Ganache Blockchain Explorer">
          <TestBlockchainExplorer />
        </Card>
      )}
    </div>
  );
};

export default TestFeatures;
