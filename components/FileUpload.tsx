'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { supabase } from '@/lib/supabaseClient'
import Toast from './Toast'

interface FileUploadProps {
  projectId: string
  onFileUploaded?: (file: { name: string; url: string }) => void
  existingFiles?: Array<{ name: string; url: string }>
}

export default function FileUpload({ projectId, onFileUploaded, existingFiles = [] }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState(existingFiles)
  const [toast, setToast] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setUploading(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${projectId}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName)

      const newFile = { name: file.name, url: publicUrl }
      setFiles([...files, newFile])
      onFileUploaded?.(newFile)
      
      setToastType('success')
      setToast('Fichier uploadé avec succès')
    } catch (error: any) {
      setToastType('error')
      setToast(`Erreur lors de l'upload: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach(uploadFile)
    }
  }

  const removeFile = async (fileUrl: string, fileName: string) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/')
      const filePath = urlParts.slice(-2).join('/')
      
      const { error } = await supabase.storage
        .from('project-files')
        .remove([filePath])

      if (error) throw error

      setFiles(files.filter(f => f.url !== fileUrl))
      setToastType('success')
      setToast('Fichier supprimé')
    } catch (error: any) {
      setToastType('error')
      setToast(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Fichiers du projet</h4>
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Upload...' : 'Ajouter des fichiers'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />

          <div className="space-y-2">
            {files.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                Aucun fichier uploadé
              </p>
            ) : (
              files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(file.url, '_blank')}
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(file.url, file.name)}
                      title="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Toast message={toast} onClose={() => setToast(null)} type={toastType} />
      </CardContent>
    </Card>
  )
}