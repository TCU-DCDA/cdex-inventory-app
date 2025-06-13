import { useState } from 'react';
import { Search, User, BookOpen, Camera, Mic, Monitor, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

const InventoryApp = () => {
  console.log('InventoryApp component is rendering - Google Sheets Integration', new Date().toISOString());
  
  // Google Sheets integration
  const {
    equipment,
    checkouts,
    isLoading,
    error,
    isOnline,
    isConfigured,
    addCheckout,
    markAsReturned,
    refreshData
  } = useGoogleSheets();

  // Form state
  const [activeTab, setActiveTab] = useState('checkout');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentMajor, setStudentMajor] = useState('');
  const [facultySponsor, setFacultySponsor] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [comments, setComments] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Video Camera - Professional', 'Video Camera - Standard', 'DSLR Camera', 'Yeti Microphone', 'PC Laptop', 'Mac Laptop'];

  const getIcon = (category: string) => {
    switch (category) {
      case 'Video Camera - Professional':
      case 'Video Camera - Standard':
        return <Camera className="w-5 h-5" />;
      case 'DSLR Camera':
        return <Camera className="w-5 h-5" />;
      case 'Yeti Microphone':
        return <Mic className="w-5 h-5" />;
      case 'PC Laptop':
      case 'Mac Laptop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const availableEquipment = equipment.filter(item => item.available);
  const activeCheckouts = checkouts.filter(checkout => !checkout.returned);
  const filteredCheckouts = activeCheckouts.filter(checkout =>
    checkout.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((checkout as any).studentEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const isFormComplete = studentName.trim() !== '' && 
                        studentId.trim() !== '' && 
                        studentEmail.trim() !== '' &&
                        isValidEmail(studentEmail) &&
                        studentMajor.trim() !== '' && 
                        facultySponsor.trim() !== '' && 
                        selectedEquipment !== '';

  // Form completion progress
  const completedFields = [
    studentName.trim() !== '',
    studentId.trim() !== '',
    studentEmail.trim() !== '' && isValidEmail(studentEmail),
    studentMajor.trim() !== '',
    facultySponsor.trim() !== '',
    selectedEquipment !== ''
  ].filter(Boolean).length;
  const totalFields = 6;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const handleCheckout = async () => {
    if (!isFormComplete) {
      alert('Please fill in all fields before completing checkout');
      return;
    }

    const equipmentItem = equipment.find(item => item.id === parseInt(selectedEquipment));
    if (!equipmentItem || !equipmentItem.available) {
      alert('Selected equipment is not available');
      return;
    }

    const checkoutData = {
      studentName,
      studentId,
      studentEmail,
      studentMajor,
      facultySponsor,
      comments: comments.trim(),
      checkoutDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      equipmentId: equipmentItem.id,
      equipmentName: equipmentItem.name,
      serialNumber: equipmentItem.serialNumber,
      returned: false
    };

    const success = await addCheckout(checkoutData);
    
    if (success) {
      // Reset form
      setStudentName('');
      setStudentId('');
      setStudentEmail('');
      setStudentMajor('');
      setFacultySponsor('');
      setSelectedEquipment('');
      setComments('');
      
      alert('Equipment checked out successfully!');
    } else {
      alert('Failed to check out equipment. Please try again.');
    }
  };

  const handleCheckin = async (checkoutId: number) => {
    const success = await markAsReturned(checkoutId);
    
    if (success) {
      alert('Equipment checked in successfully!');
    } else {
      alert('Failed to check in equipment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tcu-50 to-gray-100 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-tcu-primary text-white relative overflow-hidden rounded-t-3xl shadow-xl mb-2">
          {/* Subtle geometric background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white transform -translate-x-20 translate-y-20"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white transform -translate-x-32 -translate-y-32"></div>
          </div>
          
          <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Left side - Main branding */}
              <div className="flex-1">
                <div className="mb-3 md:mb-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-2">
                    CDEx
                  </h1>
                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                    <div className="h-0.5 bg-white w-8 md:w-12"></div>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-white/90 uppercase tracking-widest">
                      Inventory Management
                    </p>
                  </div>
                </div>
                
                <div className="space-y-0.5 md:space-y-1">
                  <p className="text-white/80 text-xs md:text-sm font-medium">
                    Center for Digital Expression
                  </p>
                  <p className="text-white/60 text-xs font-normal">
                    Texas Christian University
                  </p>
                </div>
              </div>
              
              {/* Right side - Stats - Desktop Only */}
              <div className="hidden xl:flex items-center space-x-6">
                <div className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                    <div className="text-3xl font-black text-white mb-1">{availableEquipment.length}</div>
                    <div className="text-white/70 text-xs font-medium uppercase tracking-wider">Available</div>
                  </div>
                </div>
                
                <div className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                    <div className="text-3xl font-black text-white mb-1">{activeCheckouts.length}</div>
                    <div className="text-white/70 text-xs font-medium uppercase tracking-wider">Checked Out</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom section with mobile stats (left) and status indicators (right) */}
            <div className="mt-3 md:mt-4 flex justify-between items-end">
              {/* Left side: Mobile stats */}
              <div className="xl:hidden flex justify-start space-x-4">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-black text-white">{availableEquipment.length}</div>
                  <div className="text-white/70 text-xs uppercase tracking-wider">Available</div>
                </div>
                <div className="w-px bg-white/30 mx-3"></div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-black text-white">{activeCheckouts.length}</div>
                  <div className="text-white/70 text-xs uppercase tracking-wider">Checked Out</div>
                </div>
              </div>
              
              {/* Right side: Status indicators - Right aligned in 3 lines */}
              <div className="flex flex-col items-end space-y-2">
                {/* Line 1: Online status */}
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-white/70 text-xs">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                  {/* Loading indicator inline */}
                  {isLoading && (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full ml-2"></div>
                      <span className="text-white/70 text-xs">Loading...</span>
                    </>
                  )}
                </div>
                
                {/* Line 2: Google Sheets status (Available) */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-white/70 text-xs">
                    {isConfigured ? 'Available' : 'Local Only'}
                  </span>
                  {/* Error indicator inline */}
                  {error && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-400 ml-2"></div>
                      <span className="text-white/70 text-xs truncate max-w-32">{error}</span>
                    </>
                  )}
                </div>
                
                {/* Line 3: Refresh button */}
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-white/90 text-xs font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-tcu-200 px-4 sm:px-8 md:px-12 py-2 shadow-sm">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-4 sm:px-6 md:px-8 py-3 md:py-4 font-semibold border-b-3 transition-all duration-200 rounded-t-lg sm:rounded-none whitespace-nowrap ${
                activeTab === 'checkout' 
                  ? 'text-tcu-700 border-tcu-700 bg-tcu-50' 
                  : 'text-gray-600 border-transparent hover:text-tcu-600 hover:bg-tcu-50/50'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm md:text-base">Check Out Equipment</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-4 sm:px-6 md:px-8 py-3 md:py-4 font-semibold border-b-3 transition-all duration-200 rounded-t-lg sm:rounded-none whitespace-nowrap ${
                activeTab === 'checkin' 
                  ? 'text-tcu-700 border-tcu-700 bg-tcu-50' 
                  : 'text-gray-600 border-transparent hover:text-tcu-600 hover:bg-tcu-50/50'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm md:text-base">Check In Equipment</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 sm:px-6 md:px-8 py-3 md:py-4 font-semibold border-b-3 transition-all duration-200 rounded-t-lg sm:rounded-none whitespace-nowrap ${
                activeTab === 'inventory' 
                  ? 'text-tcu-700 border-tcu-700 bg-tcu-50' 
                  : 'text-gray-600 border-transparent hover:text-tcu-600 hover:bg-tcu-50/50'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Monitor className="w-4 h-4" />
                <span className="text-sm md:text-base">View Inventory</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-b-2xl shadow-lg border border-tcu-100">
          {/* Checkout Tab */}
          {activeTab === 'checkout' && (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Checkout Form */}
              <div className="space-y-6 md:space-y-8 mx-0 lg:mx-8">
                <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                  <div className="bg-tcu-100 p-2 md:p-3 rounded-xl">
                    <BookOpen className="w-5 md:w-7 h-5 md:h-7 text-tcu-700" />
                  </div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                    Equipment Checkout
                  </h2>
                </div>
                
                <div className="bg-tcu-50 border border-tcu-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-tcu-800 text-base font-medium">
                      📋 Please fill out all fields to complete your equipment checkout
                    </p>
                    <span className="text-sm font-semibold text-tcu-700">
                      {completedFields}/{totalFields} Complete
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        completionPercentage === 100 ? 'bg-green-500' : 
                        completionPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  
                  {!isFormComplete && (
                    <p className="text-red-600 text-sm font-medium">
                      ⚠️ All fields marked with * are required
                    </p>
                  )}
                  
                  {isFormComplete && (
                    <p className="text-green-600 text-sm font-medium">
                      ✅ All required fields completed! Ready to checkout.
                    </p>
                  )}
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-3 text-tcu-600" />
                      Student Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-3 transition-colors text-base ${
                        studentName.trim() === '' 
                          ? 'border-2 border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                          : 'border border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Student ID <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-3 transition-colors text-base ${
                        studentId.trim() === '' 
                          ? 'border-2 border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                          : 'border border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50'
                      }`}
                      placeholder="Enter your student ID"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="mr-3">📧</span>
                      Student Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-3 transition-colors text-base ${
                        studentEmail.trim() === '' || !isValidEmail(studentEmail)
                          ? 'border-2 border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                          : 'border border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50'
                      }`}
                      placeholder="Enter your @tcu.edu email"
                      required
                    />
                    {studentEmail.trim() !== '' && !isValidEmail(studentEmail) && (
                      <p className="text-red-600 text-sm mt-2">⚠️ Please enter a valid email address</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-tcu-600" />
                      Student Major <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentMajor}
                      onChange={(e) => setStudentMajor(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-3 transition-colors text-base ${
                        studentMajor.trim() === '' 
                          ? 'border-2 border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                          : 'border border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50'
                      }`}
                      placeholder="e.g., Film Production, Journalism"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Faculty Sponsor <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={facultySponsor}
                      onChange={(e) => setFacultySponsor(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-3 transition-colors text-base ${
                        facultySponsor.trim() === '' 
                          ? 'border-2 border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                          : 'border border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50'
                      }`}
                      placeholder="Enter sponsoring faculty member"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Select Equipment <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={selectedEquipment}
                      onChange={(e) => setSelectedEquipment(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-3 transition-colors text-base ${
                        selectedEquipment === '' 
                          ? 'border-2 border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                          : 'border border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50'
                      }`}
                      required
                    >
                      <option value="">Choose equipment...</option>
                      {categories.map(category => (
                        <optgroup key={category} label={category}>
                          {availableEquipment
                            .filter(item => item.category === category)
                            .map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name} - {item.serialNumber}
                              </option>
                            ))
                          }
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Comments <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-tcu-primary focus:border-tcu-primary transition-colors text-base resize-none"
                      placeholder="Any additional notes or special requirements for this equipment checkout..."
                      rows={3}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={!isFormComplete}
                      className={`w-full py-6 px-8 rounded-xl font-black focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 shadow-xl text-xl border-4 uppercase tracking-wider ${
                        isFormComplete 
                          ? 'bg-purple-700 hover:bg-purple-800 text-white border-purple-900 hover:shadow-2xl focus:ring-yellow-300 cursor-pointer' 
                          : 'bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed opacity-60'
                      }`}
                      style={isFormComplete ? { 
                        backgroundColor: '#4d1979',
                        borderColor: '#2d1050',
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      } : {
                        backgroundColor: '#9ca3af',
                        borderColor: '#6b7280',
                        color: '#4b5563'
                      }}
                    >
                      {isFormComplete ? '✅ COMPLETE CHECKOUT' : '🔒 COMPLETE ALL FIELDS'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Equipment Availability */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-tcu-100 p-3 rounded-xl">
                    <Monitor className="w-7 h-7 text-tcu-700" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Equipment Availability
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryItems = equipment.filter(item => item.category === category);
                    const availableCount = categoryItems.filter(item => item.available).length;
                    const totalCount = categoryItems.length;
                    const percentageAvailable = Math.round((availableCount / totalCount) * 100);
                    
                    return (
                      <div key={category} className="bg-gradient-to-r from-tcu-50 to-gray-50 border border-tcu-200 p-5 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className="mr-3 text-tcu-600">
                              {getIcon(category)}
                            </div>
                            <span className="font-semibold text-gray-900">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              <span className={availableCount > 0 ? 'text-green-600' : 'text-red-500'}>
                                {availableCount}
                              </span>
                              <span className="text-gray-400"> / {totalCount}</span>
                            </div>
                            <div className="text-xs text-gray-500 font-medium">available</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentageAvailable > 66 ? 'bg-green-500' : 
                              percentageAvailable > 33 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentageAvailable}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 text-right">
                          {percentageAvailable}% available
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Check In Tab */}
          {activeTab === 'checkin' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center flex-wrap gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-tcu-100 p-3 rounded-xl">
                    <CheckCircle className="w-7 h-7 text-tcu-700" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Active Checkouts
                  </h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search checkouts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-4 w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-tcu-primary focus:border-tcu-primary transition-colors text-base"
                  />
                </div>
              </div>

              {filteredCheckouts.length === 0 ? (
                <div className="text-center py-20 bg-tcu-50 rounded-xl border border-tcu-200">
                  <CheckCircle className="w-24 h-24 text-tcu-300 mx-auto mb-6" />
                  <p className="text-tcu-700 text-2xl font-medium">No active checkouts found</p>
                  <p className="text-tcu-600 mt-3 text-lg">All equipment is available for checkout</p>
                </div>
              ) : (
                <div className="grid gap-8">
                  {filteredCheckouts.map(checkout => (
                    <div key={checkout.id} className="bg-white border border-tcu-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-tcu-100 p-3 rounded-full">
                              <User className="w-6 h-6 text-tcu-700" />
                            </div>
                            <h3 className="font-bold text-2xl text-gray-900">
                              {checkout.studentName}
                            </h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6 text-base">
                            <div className="space-y-3">
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Student ID:</span> 
                                <span className="text-gray-700">{checkout.studentId}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Email:</span> 
                                <span className="text-gray-700">{checkout.studentEmail}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Major:</span> 
                                <span className="text-gray-700">{checkout.studentMajor}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Sponsor:</span> 
                                <span className="text-gray-700">{checkout.facultySponsor}</span>
                              </p>
                            </div>
                            <div className="space-y-3">
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Equipment:</span> 
                                <span className="text-gray-700">{checkout.equipmentName}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Serial:</span> 
                                <span className="text-gray-700 font-mono">{checkout.serialNumber}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="font-semibold text-tcu-700 w-28">Due:</span> 
                                <span className="text-red-600 font-medium">{checkout.returnDate}</span>
                              </p>
                            </div>
                          </div>
                          {(checkout as any).comments && (checkout as any).comments.trim() !== '' && (
                            <div className="mt-6 p-4 bg-tcu-50 rounded-lg border border-tcu-200">
                              <h4 className="font-semibold text-tcu-700 mb-2">Comments:</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">{(checkout as any).comments}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleCheckin(checkout.id)}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-3 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-lg ml-6"
                        >
                          Check In
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="bg-tcu-100 p-3 rounded-xl">
                  <Monitor className="w-7 h-7 text-tcu-700" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Equipment Inventory</h2>
              </div>
              
              {categories.map(category => {
                const categoryItems = equipment.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                const availableCount = categoryItems.filter(item => item.available).length;
                const totalCount = categoryItems.length;

                return (
                  <div key={category} className="bg-white border border-tcu-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <div className="mr-4 text-tcu-600">
                          {getIcon(category)}
                        </div>
                        {category}
                      </h3>
                      <div className="text-base font-medium">
                        <span className="text-green-600">{availableCount}</span>
                        <span className="text-gray-400"> / {totalCount} available</span>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-tcu-50 to-gray-50 rounded-xl border border-tcu-100 hover:shadow-sm transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div>
                              <span className="font-semibold text-gray-900 text-lg">{item.name}</span>
                              <span className="text-gray-500 ml-3 font-mono text-base">({item.serialNumber})</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {item.available ? (
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                                <XCircle className="w-4 h-4 mr-2" />
                                Checked Out
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryApp;
