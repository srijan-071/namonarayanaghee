import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore/lite";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, phone, cartItems, subtotal } = data;

    if (!email) {
      return NextResponse.json({ success: false, error: "No email provided" }, { status: 400 });
    }

    // We use the email as the document ID to update the same abandoned cart session
    // Or we could generate a unique ID. Let's use email so it overwrites their latest cart.
    const cartRef = doc(db, "abandoned_carts", email);
    
    await setDoc(cartRef, {
      email,
      phone: phone || "",
      cartItems,
      subtotal,
      lastActive: serverTimestamp(),
      recovered: false,
      notified: false
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save abandoned cart:", error);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (email) {
      const { deleteDoc } = await import("firebase/firestore/lite");
      const cartRef = doc(db, "abandoned_carts", email);
      await deleteDoc(cartRef);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
