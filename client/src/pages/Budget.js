import React, { useState, useEffect } from 'react';
import { budgetAPI, categoriesAPI, transactionsAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        budgetAPI.getActive(),
        categoriesAPI.getAll(),
        transactionsAPI.getAll(),
      ]);
      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data || []);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      // Hata durumunda boş array'ler set et
      setCategories([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSpent = (budget) => {
    const startDate = new Date(budget.start_date);
    const endDate = budget.end_date ? new Date(budget.end_date) : new Date();
    
    const categoryTransactions = transactions.filter(
      (t) =>
        t.category_id === budget.category_id &&
        t.type === 'expense' &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
    );

    return categoryTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await budgetAPI.update(editingBudget.id, formData);
      } else {
        await budgetAPI.create(formData);
      }
      setShowModal(false);
      setEditingBudget(null);
      setFormData({
        category_id: '',
        amount: '',
        period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
      });
      loadData();
    } catch (error) {
      console.error('Bütçe kaydedilirken hata:', error);
      alert('Bütçe kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id,
      amount: budget.amount,
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu bütçe limitini silmek istediğinize emin misiniz?')) {
      try {
        await budgetAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Bütçe silinirken hata:', error);
        alert('Bütçe silinemedi. Lütfen tekrar deneyin.');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const getPeriodLabel = (period) => {
    const labels = {
      daily: 'Günlük',
      weekly: 'Haftalık',
      monthly: 'Aylık',
      yearly: 'Yıllık',
    };
    return labels[period] || period;
  };

  const expenseCategories = categories.filter((cat) => cat.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bütçe Limitleri</h1>
        <button
          onClick={async () => {
            // Modal açılırken kategorileri yeniden yükle
            try {
              const categoriesRes = await categoriesAPI.getAll();
              setCategories(categoriesRes.data || []);
            } catch (error) {
              console.error('Kategoriler yüklenirken hata:', error);
            }
            setEditingBudget(null);
            setFormData({
              category_id: '',
              amount: '',
              period: 'monthly',
              start_date: new Date().toISOString().split('T')[0],
              end_date: '',
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Yeni Bütçe Limiti</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          Henüz bütçe limiti tanımlanmamış
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const spent = calculateSpent(budget);
            const remaining = budget.amount - spent;
            const percentage = (spent / budget.amount) * 100;
            const category = categories.find((c) => c.id === budget.category_id);

            return (
              <div
                key={budget.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${budget.category_color}20` }}
                    >
                      {category?.icon || '💰'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.category_name}</h3>
                      <p className="text-sm text-gray-500">{getPeriodLabel(budget.period)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Harcanan</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage > 100
                            ? 'bg-red-600'
                            : percentage > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Kalan</span>
                    <span
                      className={`font-semibold ${
                        remaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {formatCurrency(remaining)}
                    </span>
                  </div>

                  {percentage > 100 && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                      <FiAlertCircle className="w-4 h-4" />
                      <span>Bütçe limiti aşıldı!</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingBudget ? 'Bütçe Limiti Düzenle' : 'Yeni Bütçe Limiti'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {expenseCategories.length > 0 ? (
                    expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Gider kategorisi bulunamadı. Önce kategori ekleyin.
                    </option>
                  )}
                </select>
                {expenseCategories.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    Gider kategorisi yok. Lütfen önce "Kategoriler" sayfasından gider kategorisi ekleyin.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limit Tutarı
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periyot
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="yearly">Yıllık</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBudget(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingBudget ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;

