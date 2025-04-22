import { User } from "../Models/userModel.js";

const verifyConfirmationForNewAccount = async (req, res) => {
    try {
        const { email, confirmationCode } = req.body;

        if (!email || !confirmationCode) {
            return res.json({ success: false, message: "Email or confirmation code not provided" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "User is already verified." });
        }

        const isValidCode = user.confirmationCodeFornewAcc === parseInt(confirmationCode) && user.expiresAt && user.expiresAt > Date.now();

        if (!isValidCode) {
            return res.json({ success: false, message: "Invalid or expired confirmation code." });
        }

        user.isVerified = true;
        user.confirmationCodeFornewAcc = null;
        user.expiresAt = null;
        await user.save();

        return res.json({ success: true, message: "User verified successfully." });

    } catch (error) {
        console.error("Error verifying account:", error);
        return res.json({ success: false, message: error.message });
    }
};

const verifyConfirmationForChangePass = async (req, res) => {
    try {
        const { email, confirmationCode } = req.body;

        if (!email || !confirmationCode) {
            return res.json({ success: false, message: "Email or confirmation code not provided" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.isVerified || !user.isChangedPassword) {
            return res.json({ success: false, message: "No password change in process or user not verified." });
        }

        const isValidCode = user.confirmationCodeForChangePass === parseInt(confirmationCode) && user.expiresAt && user.expiresAt > Date.now();

        if (!isValidCode) {
            return res.json({ success: false, message: "Invalid or expired confirmation code." });
        }

        user.password = user.tempPasswordHash;
        user.tempPasswordHash = null;
        user.isChangedPassword = false;
        user.confirmationCodeForChangePass = null;
        user.expiresAt = null;
        await user.save();

        return res.json({ success: true, message: "Password change verified successfully." });

    } catch (error) {
        console.error("Error verifying password change:", error);
        return res.json({ success: false, message: error.message });
    }
};

export { verifyConfirmationForNewAccount ,verifyConfirmationForChangePass};
