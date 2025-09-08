'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMilestoneContract } from '@/hooks/useContracts';
import { toast } from 'react-hot-toast';

interface Milestone {
  title: string;
  description: string;
  amount: number;
  deadline: Date;
}

export default function CreateProjectPage() {
  const { user, isAuthenticated } = useWallet();
  const { createProject, loading } = useMilestoneContract();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalAmount: 0,
    category: '',
    skills: [''],
    timeline: '',
  });
  
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      title: '',
      description: '',
      amount: 0,
      deadline: new Date(),
    },
  ]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: '',
        description: '',
        amount: 0,
        deadline: new Date(),
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    setMilestones(
      milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Submit to smart contract
      const contractResult = await createProject({
        title: formData.title,
        description: formData.description,
        milestones: milestones.map(milestone => ({
          title: milestone.title,
          description: milestone.description,
          amount: milestone.amount,
          deadline: milestone.deadline,
        })),
      });

      // Also submit to backend API
      const response = await fetch('https://stackup-backend-omega.vercel.app/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          milestones,
          creatorAddress: user.stxAddress,
          contractTxId: (contractResult as any)?.txId,
        }),
      });

      if (response.ok) {
        toast.success('Project created successfully!');
        router.push('/projects');
      } else {
        throw new Error('Failed to save project to database');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., DeFi, NFT, Gaming"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <Input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="e.g., 3 months"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Skills Required</label>
              <Input
                type="text"
                value={formData.skills.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  skills: e.target.value.split(',').map(s => s.trim()) 
                })}
                placeholder="React, Node.js, Smart Contracts"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Project Milestones</h3>
                <Button type="button" onClick={addMilestone} variant="outline">
                  Add Milestone
                </Button>
              </div>

              {milestones.map((milestone, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Milestone {index + 1}</h4>
                      {milestones.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          placeholder="Milestone title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Amount (STX)</label>
                        <Input
                          type="number"
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                        placeholder="Describe this milestone..."
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Deadline</label>
                      <Input
                        type="date"
                        value={milestone.deadline.toISOString().split('T')[0]}
                        onChange={(e) => updateMilestone(index, 'deadline', new Date(e.target.value))}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !isAuthenticated}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}