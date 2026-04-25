import React, { useState, useEffect } from 'react';
import {
    createPriceRule,
    getAllPriceRules,
    updatePriceRule,
    deletePriceRule,
    applyPriceRules,
    getPriceRuleOptions
} from '../../../utils/product.apiRequest';
import { toast } from 'react-hot-toast'; // Optional: for better alerts

const PriceUpdation = () => {
    const [rules, setRules] = useState([]);
    const [options, setOptions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        ruleName: '',
        applyTo: 'all',
        targetId: '',
        targetIds: [],
        adjustmentType: 'percentage',
        operator: 'increase',
        value: 0,
        filters: {
            hasReplacement: null,
            hasReturn: null,
            minStock: null,
            maxStock: null
        },
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        priority: 0,
        description: ''
    });

    useEffect(() => {
        fetchRules();
        fetchOptions();
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const response = await getAllPriceRules();
            setRules(response.data);
        } catch (error) {
            toast.error('Failed to fetch rules');
            console.error('Error fetching rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const response = await getPriceRuleOptions();
            setOptions(response.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createPriceRule(formData);
            toast.success('Price rule created successfully!');
            setShowForm(false);
            fetchRules();
            resetForm();
        } catch (error) {
            toast.error(error.message || 'Failed to create rule');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRule = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePriceRule(editingRule._id, formData);
            toast.success('Price rule updated successfully!');
            setEditingRule(null);
            setShowForm(false);
            fetchRules();
            resetForm();
        } catch (error) {
            toast.error(error.message || 'Failed to update rule');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule);
        setFormData({
            ruleName: rule.ruleName,
            applyTo: rule.applyTo,
            targetId: rule.targetId || '',
            targetIds: rule.targetIds || [],
            adjustmentType: rule.adjustmentType,
            operator: rule.operator,
            value: rule.value,
            filters: rule.filters || {
                hasReplacement: null,
                hasReturn: null,
                minStock: null,
                maxStock: null
            },
            isActive: rule.isActive,
            startDate: rule.startDate ? new Date(rule.startDate).toISOString().split('T')[0] : '',
            endDate: rule.endDate ? new Date(rule.endDate).toISOString().split('T')[0] : '',
            priority: rule.priority || 0,
            description: rule.description || ''
        });
        setShowForm(true);
    };

    const handleToggleRule = async (ruleId, currentStatus) => {
        try {
            await updatePriceRule(ruleId, { isActive: !currentStatus });
            toast.success(`Rule ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            fetchRules();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteRule = async (ruleId) => {
        if (window.confirm('Are you sure you want to delete this rule?')) {
            try {
                await deletePriceRule(ruleId);
                toast.success('Rule deleted successfully');
                fetchRules();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleApplyRules = async () => {
        if (window.confirm('Apply all active price rules to products?')) {
            setLoading(true);
            try {
                const response = await applyPriceRules();
                toast.success(response.message);
                fetchRules();
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            ruleName: '',
            applyTo: 'all',
            targetId: '',
            targetIds: [],
            adjustmentType: 'percentage',
            operator: 'increase',
            value: 0,
            filters: {
                hasReplacement: null,
                hasReturn: null,
                minStock: null,
                maxStock: null
            },
            isActive: true,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            priority: 0,
            description: ''
        });
        setEditingRule(null);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500">
                                Price Rules Manager
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Create and manage automated price adjustment rules
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleApplyRules}
                                disabled={loading}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Apply All Rules
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(!showForm);
                                    if (!showForm) resetForm();
                                }}
                                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {showForm ? 'Cancel' : 'Create New Rule'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Rule Form */}
                {showForm && (
                    <div className="mb-8 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">
                                {editingRule ? 'Edit Price Rule' : 'Create New Price Rule'}
                            </h2>
                        </div>
                        <form onSubmit={editingRule ? handleUpdateRule : handleCreateRule} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Rule Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        placeholder="e.g., Summer Sale 2024"
                                        value={formData.ruleName}
                                        onChange={(e) => setFormData({...formData, ruleName: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Apply To *
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        value={formData.applyTo}
                                        onChange={(e) => setFormData({...formData, applyTo: e.target.value})}
                                    >
                                        <option value="all">All Products</option>
                                        <option value="category">Specific Category</option>
                                        <option value="brand">Specific Brand</option>
                                        <option value="product">Specific Products</option>
                                    </select>
                                </div>

                                {formData.applyTo === 'category' && options && (
                                    <div>
                                        <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                            Select Category *
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                            value={formData.targetId}
                                            onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                                        >
                                            <option value="">Choose a category</option>
                                            {options.categories?.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat._id} ({cat.count} products)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {formData.applyTo === 'brand' && options && (
                                    <div>
                                        <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                            Select Brand *
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                            value={formData.targetId}
                                            onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                                        >
                                            <option value="">Choose a brand</option>
                                            {options.brands?.map(brand => (
                                                <option key={brand._id} value={brand._id}>
                                                    {brand._id} ({brand.count} products)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Adjustment Type
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        value={formData.adjustmentType}
                                        onChange={(e) => setFormData({...formData, adjustmentType: e.target.value})}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Operation
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        value={formData.operator}
                                        onChange={(e) => setFormData({...formData, operator: e.target.value})}
                                    >
                                        <option value="increase">Increase (+) → Price Up</option>
                                        <option value="decrease">Decrease (-) → Price Down</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Value *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                            value={formData.value}
                                            onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                                        />
                                        <span className="absolute right-3 top-2 text-red-500 font-semibold">
                                            {formData.adjustmentType === 'percentage' ? '%' : '₹'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Priority (Higher = More Important)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        End Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white"
                                        rows="3"
                                        placeholder="Describe the purpose of this price rule..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : (editingRule ? 'Update Rule' : 'Create Rule')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Rules List */}
                <div className="bg-white dark:bg-black rounded-2xl border border-red-200 dark:border-red-800 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Active Price Rules</h2>
                        <p className="text-red-100 text-sm mt-1">Manage and monitor your price adjustment rules</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        </div>
                    ) : rules.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No price rules yet</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating your first price rule</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                            >
                                Create First Rule
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-red-50 dark:bg-red-950/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Rule</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Target</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Adjustment</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Schedule</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-100 dark:divide-red-900">
                                    {rules.map((rule) => (
                                        <tr key={rule._id} className="hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">{rule.ruleName}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rule.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                                    {rule.applyTo === 'all' && 'All Products'}
                                                    {rule.applyTo === 'category' && `Category: ${rule.targetId}`}
                                                    {rule.applyTo === 'brand' && `Brand: ${rule.targetId}`}
                                                    {rule.applyTo === 'product' && `${rule.targetIds?.length || 0} specific products`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    rule.operator === 'increase' 
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                }`}>
                                                    {rule.operator === 'increase' ? '↑' : '↓'} {rule.value}
                                                    {rule.adjustmentType === 'percentage' ? '%' : '₹'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 dark:text-white font-semibold">{rule.priority}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleRule(rule._id, rule.isActive)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                                        rule.isActive 
                                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                                            : 'bg-gray-400 hover:bg-gray-500 text-white'
                                                    }`}
                                                >
                                                    {rule.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <div>Start: {new Date(rule.startDate).toLocaleDateString()}</div>
                                                    {rule.endDate && <div>End: {new Date(rule.endDate).toLocaleDateString()}</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditRule(rule)}
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                        title="Edit Rule"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRule(rule._id)}
                                                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                        title="Delete Rule"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                {rules.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                            <div className="text-red-600 dark:text-red-400 text-sm font-semibold">Total Rules</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{rules.length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <div className="text-green-600 dark:text-green-400 text-sm font-semibold">Active Rules</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{rules.filter(r => r.isActive).length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total Categories</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{options?.categories?.length || 0}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                            <div className="text-purple-600 dark:text-purple-400 text-sm font-semibold">Total Brands</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{options?.brands?.length || 0}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceUpdation;