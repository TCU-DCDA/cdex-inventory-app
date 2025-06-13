import { useState } from 'react';
import { Search, User, BookOpen, Camera, Mic, Monitor, CheckCircle, XCircle } from 'lucide-react';

const InventoryApp = () => {
  console.log('InventoryApp component is rendering');
  
  // Dummy equipment data
  const [equipment, setEquipment] = useState([
    // Video Cameras
    { id: 1, name: 'Canon EOS R5', category: 'Video Camera - Professional', serialNumber: 'CR5001', available: true },
    { id: 2, name: 'Canon EOS R5', category: 'Video Camera - Professional', serialNumber: 'CR5002', available: false },
    { id: 3, name: 'Sony FX3', category: 'Video Camera - Professional', serialNumber: 'SF3001', available: true },
    { id: 4, name: 'Canon EOS R6', category: 'Video Camera - Standard', serialNumber: 'CR6001', available: true },
    { id: 5, name: 'Canon EOS R6', category: 'Video Camera - Standard', serialNumber: 'CR6002', available: true },
    { id: 6, name: 'Sony A7 III', category: 'Video Camera - Standard', serialNumber: 'SA7001', available: false },
    
    // DSLR Cameras
    { id: 7, name: 'Canon 5D Mark IV', category: 'DSLR Camera', serialNumber: '5D001', available: true },
    { id: 8, name: 'Canon 5D Mark IV', category: 'DSLR Camera', serialNumber: '5D002', available: true },
    { id: 9, name: 'Nikon D850', category: 'DSLR Camera', serialNumber: 'ND001', available: false },
    
    // Yeti Microphones
    { id: 10, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY001', available: true },
    { id: 11, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY002', available: true },
    { id: 12, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY003', available: false },
    { id: 13, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY004', available: true },
    
    // PC Laptops
    { id: 14, name: 'Dell XPS 15', category: 'PC Laptop', serialNumber: 'DX001', available: true },
    { id: 15, name: 'Dell XPS 15', category: 'PC Laptop', serialNumber: 'DX002', available: false },
    { id: 16, name: 'HP Spectre x360', category: 'PC Laptop', serialNumber: 'HS001', available: true },
    { id: 17, name: 'HP Spectre x360', category: 'PC Laptop', serialNumber: 'HS002', available: true },
    { id: 18, name: 'Lenovo ThinkPad X1', category: 'PC Laptop', serialNumber: 'LT001', available: true },
    
    // Mac Laptops
    ...Array.from({length: 15}, (_, i) => ({
      id: 19 + i,
      name: 'MacBook Pro 16"',
      category: 'Mac Laptop',
      serialNumber: `MBP${String(i + 1).padStart(3, '0')}`,
      available: i % 4 !== 0
    }))
  ]);

  // Dummy checkout data
  const [checkouts, setCheckouts] = useState([
    {
      id: 1,
      studentName: 'Sarah Johnson',
      studentId: 'SJ12345',
      studentMajor: 'Film Production',
      facultySponsor: 'Dr. Smith',
      checkoutDate: '2024-06-10',
      returnDate: '2024-06-17',
      equipmentId: 2,
      equipmentName: 'Canon EOS R5',
      serialNumber: 'CR5002',
      returned: false
    },
    {
      id: 2,
      studentName: 'Mike Chen',
      studentId: 'MC67890',
      studentMajor: 'Journalism',
      facultySponsor: 'Prof. Johnson',
      checkoutDate: '2024-06-08',
      returnDate: '2024-06-15',
      equipmentId: 6,
      equipmentName: 'Sony A7 III',
      serialNumber: 'SA7001',
      returned: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('checkout');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentMajor, setStudentMajor] = useState('');
  const [facultySponsor, setFacultySponsor] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
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
    checkout.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    if (!studentName || !studentId || !studentMajor || !facultySponsor || !selectedEquipment) {
      alert('Please fill in all fields');
      return;
    }

    const equipmentItem = equipment.find(item => item.id === parseInt(selectedEquipment));
    if (!equipmentItem || !equipmentItem.available) {
      alert('Selected equipment is not available');
      return;
    }

    const newCheckout = {
      id: checkouts.length + 1,
      studentName,
      studentId,
      studentMajor,
      facultySponsor,
      checkoutDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      equipmentId: equipmentItem.id,
      equipmentName: equipmentItem.name,
      serialNumber: equipmentItem.serialNumber,
      returned: false
    };

    setCheckouts([...checkouts, newCheckout]);
    
    setEquipment(equipment.map(item => 
      item.id === parseInt(selectedEquipment) ? { ...item, available: false } : item
    ));

    setStudentName('');
    setStudentId('');
    setStudentMajor('');
    setFacultySponsor('');
    setSelectedEquipment('');
    
    alert('Equipment checked out successfully!');
  };

  const handleCheckin = (checkoutId: number) => {
    setCheckouts(checkouts.map(checkout => 
      checkout.id === checkoutId ? { ...checkout, returned: true } : checkout
    ));
    
    const checkout = checkouts.find(c => c.id === checkoutId);
    if (checkout) {
      setEquipment(equipment.map(item => 
        item.id === checkout.equipmentId ? { ...item, available: true } : item
      ));
    }
    
    alert('Equipment checked in successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-purple-700 text-white p-8 rounded-t-2xl">
          <h1 className="text-3xl font-bold mb-2">
            CDEx Inventory Management
          </h1>
          <p className="text-purple-100">Center for Digital Expression - Texas Christian University</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-8">
          <div className="flex space-x-0">
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'checkout' 
                  ? 'text-purple-600 border-purple-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Check Out Equipment
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'checkin' 
                  ? 'text-purple-600 border-purple-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Check In Equipment
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'inventory' 
                  ? 'text-purple-600 border-purple-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              View Inventory
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-8 rounded-b-2xl shadow-lg">
          {/* Checkout Tab */}
          {activeTab === 'checkout' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Check Out Equipment
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter student name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter student ID"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Student Major
                    </label>
                    <input
                      type="text"
                      value={studentMajor}
                      onChange={(e) => setStudentMajor(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter student major"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sponsoring Faculty Member
                    </label>
                    <input
                      type="text"
                      value={facultySponsor}
                      onChange={(e) => setFacultySponsor(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter faculty sponsor"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Equipment
                    </label>
                    <select
                      value={selectedEquipment}
                      onChange={(e) => setSelectedEquipment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
                  >
                    Check Out Equipment
                  </button>
                </div>
              </div>

              {/* Equipment Availability */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Equipment Availability
                </h2>
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryItems = equipment.filter(item => item.category === category);
                    const availableCount = categoryItems.filter(item => item.available).length;
                    const totalCount = categoryItems.length;
                    
                    return (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="mr-3 text-purple-600">
                              {getIcon(category)}
                            </div>
                            <span className="font-medium text-gray-900">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              <span className={availableCount > 0 ? 'text-green-600' : 'text-red-500'}>
                                {availableCount}
                              </span>
                              <span className="text-gray-400"> / {totalCount}</span>
                            </div>
                            <div className="text-xs text-gray-500">available</div>
                          </div>
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Active Checkouts
                </h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search checkouts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {filteredCheckouts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No active checkouts found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCheckouts.map(checkout => (
                    <div key={checkout.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {checkout.studentName}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Student ID:</span> {checkout.studentId}</p>
                            <p><span className="font-medium">Major:</span> {checkout.studentMajor}</p>
                            <p><span className="font-medium">Faculty Sponsor:</span> {checkout.facultySponsor}</p>
                            <p><span className="font-medium">Equipment:</span> {checkout.equipmentName} - {checkout.serialNumber}</p>
                            <p><span className="font-medium">Checkout Date:</span> {checkout.checkoutDate}</p>
                            <p><span className="font-medium">Return Date:</span> {checkout.returnDate}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCheckin(checkout.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Equipment Inventory</h2>
              
              {categories.map(category => {
                const categoryItems = equipment.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="mr-3 text-purple-600">
                        {getIcon(category)}
                      </div>
                      {category}
                    </h3>
                    <div className="grid gap-2">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-500 ml-2">({item.serialNumber})</span>
                          </div>
                          <div className="flex items-center">
                            {item.available ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
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
