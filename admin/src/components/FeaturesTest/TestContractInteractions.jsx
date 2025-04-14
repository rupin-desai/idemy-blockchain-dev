import React, { useEffect, useState } from "react";
import { RefreshCw, AlertCircle, Check, ExternalLink } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import useContractInteraction from "../../hooks/useContractInteraction";

const TestContractInteractions = () => {
  const { 
    loading, 
    error, 
    contracts, 
    studentCount,
    verificationResult,
    cardValidityResult,
    getContractAddresses, 
    verifyStudentRecords, 
    checkCardValidity,
    getStudentCount 
  } = useContractInteraction();

  const [studentId, setStudentId] = useState("");
  const [lastAction, setLastAction] = useState("");
  
  // Get contract addresses and student count when component mounts
  useEffect(() => {
    getContractAddresses()
      .then(() => getStudentCount())
      .catch(err => console.error("Error initializing blockchain data:", err));
  }, [getContractAddresses, getStudentCount]);

  const handleVerifyStudentRecords = async () => {
    try {
      setLastAction("Verifying student records on blockchain...");
      await verifyStudentRecords();
      setLastAction("Student records verified successfully");
    } catch (err) {
      setLastAction(`Error: ${err.message}`);
      console.error("Failed to verify student records:", err);
    }
  };
  
  const handleCheckCardValidity = async () => {
    if (!studentId.trim()) {
      alert("Please enter a student ID");
      return;
    }
    
    try {
      setLastAction(`Checking validity of student card ${studentId}...`);
      await checkCardValidity(studentId);
      setLastAction(`Card validity check complete for ${studentId}`);
    } catch (err) {
      setLastAction(`Error: ${err.message}`);
      console.error("Failed to check card validity:", err);
    }
  };
  
  const handleGetStudentCount = async () => {
    try {
      setLastAction("Getting student count from blockchain...");
      await getStudentCount();
      setLastAction("Student count retrieved");
    } catch (err) {
      setLastAction(`Error: ${err.message}`);
      console.error("Failed to get student count:", err);
    }
  };

  return (
    <Card className="p-5">
      <h3 className="font-medium text-lg mb-4">Student Blockchain Contracts</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {lastAction && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-sm">
          {lastAction}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Identity Contract</h4>
            {loading && <span className="text-xs text-blue-500">Loading...</span>}
          </div>
          
          <div className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
            <code className="text-xs font-mono break-all">
              {contracts?.identityContract || 'Not connected'}
            </code>
          </div>
          
          <div className="mt-4 flex flex-col space-y-2">
            <Button 
              size="sm" 
              variant="primary"
              icon={<RefreshCw className={loading ? "animate-spin" : ""} size={14} />}
              disabled={loading || !contracts?.identityContract}
              onClick={handleVerifyStudentRecords}
            >
              Verify Student Records
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary"
              disabled={loading || !contracts?.identityContract}
              onClick={handleGetStudentCount}
            >
              Get Student Count
            </Button>
          </div>
          
          {studentCount > 0 && (
            <div className="mt-3 p-2 bg-green-50 text-green-800 text-sm rounded">
              <div className="flex items-center">
                <Check size={14} className="mr-1" />
                <span>Total Students: <strong>{studentCount}</strong></span>
              </div>
            </div>
          )}
          
          {verificationResult && (
            <div className="mt-3 p-2 bg-blue-50 text-blue-800 text-sm rounded">
              <p>
                <strong>Verification Result:</strong> {verificationResult.verified ? 'Valid' : 'Invalid'}
              </p>
              {verificationResult.recordsChecked && (
                <p className="mt-1">Records checked: {verificationResult.recordsChecked}</p>
              )}
              {verificationResult.validRecords && (
                <p className="mt-1">Valid records: {verificationResult.validRecords}</p>
              )}
              {verificationResult.message && (
                <p className="mt-1">{verificationResult.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Student ID Card Contract</h4>
          <div className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
            <code className="text-xs font-mono break-all">
              {contracts?.cardContract || 'Not connected'}
            </code>
          </div>
          
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID (e.g., CS12345)"
                className="p-2 border rounded w-full text-sm"
                disabled={loading}
              />
            </div>
            
            <Button 
              size="sm"
              variant="primary"
              icon={<RefreshCw className={loading ? "animate-spin" : ""} size={14} />}
              disabled={loading || !contracts?.cardContract || !studentId.trim()}
              onClick={handleCheckCardValidity}
            >
              Check Card Validity
            </Button>
          </div>
          
          {cardValidityResult && (
            <div className={`mt-3 p-3 ${
              cardValidityResult.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            } text-sm rounded`}>
              <div className="flex items-center">
                {cardValidityResult.valid ? (
                  <Check size={14} className="mr-1" />
                ) : (
                  <AlertCircle size={14} className="mr-1" />
                )}
                <span>
                  Card {cardValidityResult.valid ? 'is valid' : 'is invalid'}
                </span>
              </div>
              {cardValidityResult.studentId && (
                <p className="mt-1">Student ID: {cardValidityResult.studentId}</p>
              )}
              {cardValidityResult.message && (
                <p className="mt-1">{cardValidityResult.message}</p>
              )}
              {cardValidityResult.expiryDate && (
                <p className="mt-1">Expiration: {cardValidityResult.expiryDate}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TestContractInteractions;
