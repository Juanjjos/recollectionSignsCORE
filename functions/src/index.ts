import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function que se dispara cada vez que se crea un documento en /firmas
 * Automáticamente incrementa el contador en /estadisticas/contador
 */
export const incrementarContador = functions.firestore
  .document('firmas/{firmaId}')
  .onCreate(async (snap, context) => {
    try {
      const firmaData = snap.data();
      
      console.log('✅ Nueva firma creada:', {
        firmaId: context.params.firmaId,
        email: firmaData.email,
        nombre: firmaData.nombre,
        timestamp: new Date().toISOString()
      });

      // Incrementar el contador usando FieldValue.increment
      // Esto es atomático y seguro incluso con múltiples operaciones simultáneas
      const updateResult = await db.collection('estadisticas').doc('contador').update({
        total: admin.firestore.FieldValue.increment(1),
        ultimaActualizacion: admin.firestore.Timestamp.now(),
        ultimaFirma: {
          nombre: firmaData.nombre,
          apellido: firmaData.apellido,
          timestamp: admin.firestore.Timestamp.now()
        }
      });

      console.log('✅ Contador actualizado exitosamente');
      return updateResult;

    } catch (error: any) {
      // Si el documento /estadisticas/contador no existe, lo crea
      if (error.code === 'NOT_FOUND') {
        console.log('⚠️ Documento contador no existe, creándolo...');
        
        try {
          await db.collection('estadisticas').doc('contador').set({
            total: 1,
            ultimaActualizacion: admin.firestore.Timestamp.now(),
            ultimaFirma: {
              nombre: snap.data().nombre,
              apellido: snap.data().apellido,
              timestamp: admin.firestore.Timestamp.now()
            }
          });
          
          console.log('✅ Documento contador creado exitosamente');
          return;
        } catch (createError) {
          console.error('❌ Error al crear contador:', createError);
          throw createError;
        }
      }

      console.error('❌ Error al actualizar contador:', error);
      throw error;
    }
  });

/**
 * Cloud Function HTTP para obtener el contador actual (opcional - para debug)
 * URL: https://[region]-[project].cloudfunctions.net/obtenerContador
 */
export const obtenerContador = functions.https.onRequest(async (req, res) => {
  try {
    const doc = await db.collection('estadisticas').doc('contador').get();
    
    if (!doc.exists) {
      res.status(404).json({ error: 'Contador no encontrado' });
      return;
    }

    const data = doc.data();
    res.status(200).json({
      total: data?.total || 0,
      ultimaActualizacion: data?.ultimaActualizacion,
      ultimaFirma: data?.ultimaFirma
    });

  } catch (error) {
    console.error('Error al obtener contador:', error);
    res.status(500).json({ error: 'Error al obtener contador' });
  }
});
