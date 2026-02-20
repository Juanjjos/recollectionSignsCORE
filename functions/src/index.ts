/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function que se dispara cada vez que se crea una firma
 * Incrementa automáticamente el contador en /estadisticas/contador
 */
export const incrementarContador = onDocumentCreated(
  "firmas/{firmaId}",
  async (event) => {
    try {
      // Obtener los datos de la firma recién creada
      const firmaData = event.data?.data();
      
      if (!firmaData) {
        console.error("❌ No se pudieron obtener los datos de la firma");
        return;
      }

      console.log("✅ Nueva firma creada:", {
        firmaId: event.params.firmaId,
        email: firmaData.email,
        nombre: firmaData.nombre,
        timestamp: new Date().toISOString(),
      });

      // Referencia al documento contador
      const contadorRef = db.collection("estadisticas").doc("contador");

      // Intentar actualizar el contador
      try {
        await contadorRef.update({
          total: admin.firestore.FieldValue.increment(1),
          ultimaActualizacion: admin.firestore.Timestamp.now(),
          ultimaFirma: {
            nombre: firmaData.nombre,
            apellido: firmaData.apellido,
            timestamp: admin.firestore.Timestamp.now(),
          },
        });

        console.log("✅ Contador actualizado exitosamente");
      } catch (updateError: any) {
        // Si el documento no existe, crearlo
        if (updateError.code === 5) { // NOT_FOUND
          console.log("⚠️ Documento contador no existe, creándolo...");
          
          await contadorRef.set({
            total: 1,
            ultimaActualizacion: admin.firestore.Timestamp.now(),
            ultimaFirma: {
              nombre: firmaData.nombre,
              apellido: firmaData.apellido,
              timestamp: admin.firestore.Timestamp.now(),
            },
          });
          
          console.log("✅ Documento contador creado exitosamente");
        } else {
          throw updateError;
        }
      }
    } catch (error) {
      console.error("❌ Error al procesar la firma:", error);
    }
  }
);

/**
 * Cloud Function HTTP para obtener el contador actual
 * URL: https://[region]-[project-id].cloudfunctions.net/obtenerContador
 */
export const obtenerContador = onRequest(
  {cors: true}, // Habilitar CORS para llamadas desde tu web
  async (req, res) => {
    try {
      const doc = await db.collection("estadisticas").doc("contador").get();
      
      if (!doc.exists) {
        res.status(404).json({error: "Contador no encontrado", total: 0});
        return;
      }

      const data = doc.data();
      res.status(200).json({
        total: data?.total || 0,
        ultimaActualizacion: data?.ultimaActualizacion,
        ultimaFirma: data?.ultimaFirma,
      });
    } catch (error) {
      console.error("❌ Error al obtener contador:", error);
      res.status(500).json({error: "Error al obtener contador"});
    }
  }
);