import { useState, useEffect } from 'react';
import { User, Mail, Sparkles, CheckCircle2, Flame, Target, Timer, Save } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Spinner from '../components/common/Spinner';
import { useAppData } from '../context/AppDataContext';
import { useTasks } from '../hooks/useTasks';
import { useHabits } from '../hooks/useHabits';
import { useGoals } from '../hooks/useGoals';
import { useFocusSessions } from '../hooks/useFocusSessions';

export default function ProfilePage() {
  const { profile, updateProfile, loading } = useAppData();
  const { tasks } = useTasks();
  const { bestStreak } = useHabits();
  const { completedGoals } = useGoals();
  const { focusSessions } = useFocusSessions();

  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const initials = form.name
    ? form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information and view stats</p>
      </div>

      {/* Lifetime Stats Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasksCount}</p>
          <p className="text-xs text-gray-400">Tasks Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{bestStreak} days</p>
          <p className="text-xs text-gray-400">Best Streak</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="w-6 h-6 text-brand-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedGoals}</p>
          <p className="text-xs text-gray-400">Goals Reached</p>
        </Card>
        <Card className="p-4 text-center">
          <Timer className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{focusSessions.length}</p>
          <p className="text-xs text-gray-400">Focus Sessions</p>
        </Card>
      </div>

      {/* Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-5">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover ring-2 ring-brand-500" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-600 text-white font-bold text-2xl flex items-center justify-center">
                {initials}
              </div>
            )}
            <div>
              <label className="btn-secondary text-xs cursor-pointer inline-block py-2 px-3">
                Upload New Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <p className="text-xs text-gray-400 mt-1">Recommended: Square JPG or PNG</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <Textarea
            label="Bio / Life Mission"
            placeholder="Write a short statement or life manifesto..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
          />

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : <span />}
            <Button type="submit" icon={Save}>Save Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
